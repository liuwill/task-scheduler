const config = require('../config')
const Redis = require('ioredis')
const redis = new Redis(config.redis)

redis.on('connect', () => {
  console.log(`connect to redis(${config.redis.host}) success`)
})

redis.on('error', err => {
  console.error(`connect to redis(${config.redis.host}) failure, reason: ${err.toString()}`)
})
exports.redis = redis
