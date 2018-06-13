const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
}

if (process.env.REDIS_PASSWORD) {
  redisConfig['password'] = process.env.REDIS_PASSWORD
}

module.exports = {
  redis: redisConfig,
}
