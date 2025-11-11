"""ClickHouse client and connection management"""

import clickhouse_connect
from clickhouse_connect.driver.client import Client
import structlog
from app.core.config import settings

logger = structlog.get_logger()


class ClickHouseClient:
    """Async-friendly ClickHouse client wrapper"""

    def __init__(self):
        self.client: Client | None = None

    async def connect(self):
        """Establish ClickHouse connection"""
        try:
            self.client = clickhouse_connect.get_client(
                host=settings.CLICKHOUSE_HOST,
                port=settings.CLICKHOUSE_PORT,
                username=settings.CLICKHOUSE_USER,
                password=settings.CLICKHOUSE_PASSWORD,
                database=settings.CLICKHOUSE_DATABASE,
            )

            # Initialize schema
            await self.init_schema()

            logger.info("ClickHouse client connected")
        except Exception as e:
            logger.error("Failed to connect to ClickHouse", exc_info=e)
            raise

    async def disconnect(self):
        """Close ClickHouse connection"""
        if self.client:
            self.client.close()
            logger.info("ClickHouse client disconnected")

    async def init_schema(self):
        """Initialize ClickHouse tables"""

        # Metrics table (OLAP-optimized)
        create_metrics_table = """
        CREATE TABLE IF NOT EXISTS metrics (
            tenant_id UUID,
            metric_id UUID,
            metric_name String,
            timestamp DateTime64(3),
            value Float64,
            dimensions Map(String, String),
            metadata Map(String, String),
            created_at DateTime64(3) DEFAULT now64()
        ) ENGINE = MergeTree()
        PARTITION BY toYYYYMM(timestamp)
        ORDER BY (tenant_id, metric_name, timestamp)
        TTL timestamp + INTERVAL 90 DAY
        SETTINGS index_granularity = 8192
        """

        # Aggregated metrics (materialized view for performance)
        create_agg_metrics_table = """
        CREATE TABLE IF NOT EXISTS metrics_hourly (
            tenant_id UUID,
            metric_name String,
            timestamp DateTime,
            count UInt64,
            sum Float64,
            avg Float64,
            min Float64,
            max Float64,
            p50 Float64,
            p95 Float64,
            p99 Float64
        ) ENGINE = SummingMergeTree()
        PARTITION BY toYYYYMM(timestamp)
        ORDER BY (tenant_id, metric_name, timestamp)
        TTL timestamp + INTERVAL 90 DAY
        """

        create_mv = """
        CREATE MATERIALIZED VIEW IF NOT EXISTS metrics_hourly_mv
        TO metrics_hourly
        AS SELECT
            tenant_id,
            metric_name,
            toStartOfHour(timestamp) as timestamp,
            count() as count,
            sum(value) as sum,
            avg(value) as avg,
            min(value) as min,
            max(value) as max,
            quantile(0.50)(value) as p50,
            quantile(0.95)(value) as p95,
            quantile(0.99)(value) as p99
        FROM metrics
        GROUP BY tenant_id, metric_name, timestamp
        """

        try:
            self.client.command(create_metrics_table)
            self.client.command(create_agg_metrics_table)
            self.client.command(create_mv)
            logger.info("ClickHouse schema initialized")
        except Exception as e:
            logger.error("Failed to initialize ClickHouse schema", exc_info=e)
            raise

    def insert_metrics(self, data: list[dict]):
        """Insert metrics in batch"""
        if not data:
            return

        try:
            self.client.insert(
                "metrics",
                data,
                column_names=[
                    "tenant_id",
                    "metric_id",
                    "metric_name",
                    "timestamp",
                    "value",
                    "dimensions",
                    "metadata",
                ],
            )
            logger.info("Inserted metrics batch", count=len(data))
        except Exception as e:
            logger.error("Failed to insert metrics", exc_info=e, count=len(data))
            raise

    def query_metrics(
        self,
        tenant_id: str,
        metric_name: str,
        start_time: str,
        end_time: str,
        dimensions: dict | None = None,
    ):
        """Query metrics with optional dimension filters"""

        query = f"""
        SELECT
            timestamp,
            value,
            dimensions,
            metadata
        FROM metrics
        WHERE tenant_id = '{tenant_id}'
          AND metric_name = '{metric_name}'
          AND timestamp BETWEEN '{start_time}' AND '{end_time}'
        """

        if dimensions:
            for key, value in dimensions.items():
                query += f" AND dimensions['{key}'] = '{value}'"

        query += " ORDER BY timestamp ASC"

        try:
            result = self.client.query(query)
            return result.result_rows
        except Exception as e:
            logger.error("Failed to query metrics", exc_info=e, metric=metric_name)
            raise

    def query_aggregated(
        self,
        tenant_id: str,
        metric_name: str,
        start_time: str,
        end_time: str,
    ):
        """Query pre-aggregated hourly metrics"""

        query = f"""
        SELECT
            timestamp,
            count,
            avg,
            min,
            max,
            p50,
            p95,
            p99
        FROM metrics_hourly
        WHERE tenant_id = '{tenant_id}'
          AND metric_name = '{metric_name}'
          AND timestamp BETWEEN '{start_time}' AND '{end_time}'
        ORDER BY timestamp ASC
        """

        try:
            result = self.client.query(query)
            return result.result_rows
        except Exception as e:
            logger.error("Failed to query aggregated metrics", exc_info=e, metric=metric_name)
            raise


# Global instance
clickhouse_client = ClickHouseClient()
