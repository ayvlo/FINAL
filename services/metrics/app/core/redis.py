"""Redis client for caching and rate limiting"""

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

            # Test connection
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

    async def get(self, key: str):
        """Get value by key"""
        return await self.client.get(key)

    async def set(self, key: str, value: str, ex: int | None = None):
        """Set value with optional expiration"""
        return await self.client.set(key, value, ex=ex)

    async def delete(self, key: str):
        """Delete key"""
        return await self.client.delete(key)

    async def incr(self, key: str):
        """Increment counter"""
        return await self.client.incr(key)

    async def expire(self, key: str, seconds: int):
        """Set expiration on key"""
        return await self.client.expire(key, seconds)

    async def check_rate_limit(self, key: str, limit: int, window: int = 60):
        """Check if rate limit is exceeded"""
        current = await self.client.get(key)

        if current is None:
            await self.client.setex(key, window, 1)
            return False

        if int(current) >= limit:
            return True

        await self.client.incr(key)
        return False


# Global instance
redis_client = RedisClient()
