"""Redis client for caching"""

import redis.asyncio as redis
import structlog
from app.core.config import settings

logger = structlog.get_logger()


class RedisClient:
    """Async Redis client wrapper"""

    def __init__(self):
        self.client: redis.Redis | None = None

    async def connect(self):
        """Establish Redis connection"""
        try:
            self.client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
                decode_responses=True,
            )

            await self.client.ping()
            logger.info("Redis client connected")
        except Exception as e:
            logger.error("Failed to connect to Redis", exc_info=e)
            raise

    async def disconnect(self):
        """Close Redis connection"""
        if self.client:
            await self.client.close()
            logger.info("Redis client disconnected")


# Global instance
redis_client = RedisClient()
