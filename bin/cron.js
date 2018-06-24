const Emitter = require('events').EventEmitter
const MACHINE_ID = parseInt(Math.random() * 0xffffff, 10)

const logger = {
  storage: [],
  info() {
    const args = [].slice.call(arguments)
    const targetArgs = args.map(item => {
      if (typeof item === 'object' && item !== null) {
        return JSON.stringify(item)
      }
      return item
    })
    console.log(targetArgs.join('\t'))
    this.storage.push(targetArgs.join('\t'))
  }
}

const parseRuleString = function (rule) {
  const secondMark = ['分钟', '小时', '天', '月', '年']
  const ruleItem = rule.split(' ')

  let intervals = []
  ruleItem.forEach((item, index) => {
    if (item === '*') return

    const intervalItem = item.split('/')
    if (!intervalItem || intervalItem.length !== 2) return

    intervals.push(`${intervalItem[1]}${secondMark[index]}`)
  })
  intervals = intervals.reverse()
  return intervals.join('')
}

const parseRule = function (rule) {
  const secondMark = [60, 3600, 86400, 2592000, 31104000]
  const ruleItem = rule.split(' ')

  let interval = 0
  ruleItem.forEach((item, index) => {
    if (item === '*') return

    const intervalItem = item.split('/')
    if (!intervalItem || intervalItem.length !== 2) return

    interval += intervalItem[1] * secondMark[index]
  })

  return interval
}

const filterJobParam = (obj, fields) => {
  const result = {}
  for (const key in obj) {
    if (fields.indexOf(key) >= 0) {
      result[key] = obj[key]
    }
  }

  return result
}

const generateNowTime = () => (new Date()).toISOString()

class TaskMonitor extends Emitter {
  constructor(redis) {
    super()

    this._runnerId = MACHINE_ID

    this._redis = redis
    this._memJobs = {}
    this._localJobs = {}
    this._jobHandlers = {}
    this._jobIntervals = {}
    this._runId = {}

    this.on('fail', (jobId, err) => {
      logger.info(generateNowTime(), this._runnerId, 'fail', jobId, err)
    })

    this.on('complete', (jobId, data) => {
      logger.info(generateNowTime(), this._runnerId, 'success', jobId)
    })

    this.on('start', (jobId) => {
      logger.info(generateNowTime(), this._runnerId, 'start', jobId)
    })

    this.on('stop', (jobId) => {
      logger.info(generateNowTime(), this._runnerId, 'stop', jobId)
    })

    this.on('locked', (jobId) => {
      logger.info(generateNowTime(), this._runnerId, 'locked', jobId)
    })

    this.on('update job', (jobId, updateData) => {
      Object.assign(this._memJobs[jobId], updateData)
    })
  }

  register(id, config, handler) {
    if (!handler || !handler.execute) {
      return
    }

    this._localJobs[id] = config
    this._memJobs[id] = Object.assign({
      locked: false,
      runTimes: 0,
    }, config)
    this._jobHandlers[id] = handler
  }

  start() {
    const redis = this._redis

    return (async () => {
      const dbTasks = await redis.hgetall('store:task:jobs')

      for (const jobId in this._memJobs) {
        const storedTask = dbTasks[jobId]
        if (storedTask) {
          this._memJobs[jobId] = JSON.parse(storedTask)
        }
      }

      for (const jobId in this._memJobs) {
        const taskData = this._memJobs[jobId]
        const interval = parseRule(taskData['rule'])
        taskData.intervalHuman = parseRuleString(taskData['rule'])

        if (!interval) {
          break
        }

        this.__runTask(jobId, interval)

        taskData.interval = interval
        redis.hset('store:task:jobs', jobId, JSON.stringify(this._memJobs[jobId]))
      }
    })()
  }

  stopTask(jobId) {

  }

  startTask(jobId) {

  }

  executeTask(jobId) {
    try {
      const runId = generateUniqueId()
      this._runId[jobId] = runId

      this.emit('start', jobId)
      const asyncTask = new AsyncTask(runId, jobId, this._jobHandlers[jobId], this._redis, this)

      return asyncTask.execute().then((result) => {
        if (result === false) {
          this.emit('locked', jobId)
        } else {
          this.emit('complete', jobId)
        }
        return result
      })
    } catch (error) {
      this.emit('fail', jobId, error)
    }
  }

  __monitor() {
    setInterval(() => {
      try {

      } catch (err) { }
    }, 10000)
  }

  __runTask(jobId, interval) {
    this._jobIntervals[jobId] = setInterval(() => {
      this.executeTask(jobId)
    }, interval * 1000)
  }

  __clearTask(jobId) {
    clearInterval(this._jobIntervals[jobId])
  }

  async listTasks() {
    return this._memJobs
  }

  async getTaskById(jobId) {
    return this._memJobs[jobId]
  }

  async reloadTask(jobId) {
    const redis = this._redis

    const storedTaskStr = await redis.hget('store:task:jobs', jobId)
    let storedTask = {}
    if (storedTaskStr) {
      storedTask = JSON.parse(storedTaskStr)
    }
    const taskData = this._localJobs[jobId]

    const interval = parseRule(taskData['rule'])
    taskData.intervalHuman = parseRuleString(taskData['rule'])

    if (!interval) {
      return
    }
    this.__clearTask(jobId)

    this.__runTask(jobId, interval)
    taskData.interval = interval

    const memJob = Object.assign(storedTask, filterJobParam(taskData, ['command', 'name', 'rule', 'state', 'description']))
    this._memJobs[jobId] = memJob
    redis.hset('store:task:jobs', jobId, JSON.stringify(this._memJobs[jobId]))
  }

  async loadLog() {
  }

  clear() {
    const redis = this._redis
    return redis.del('store:task:jobs')
  }
}

class AsyncTask {
  constructor(runId, jobId, handler, redis, emitter) {
    this.jobId = jobId
    this.handler = handler
    this.redis = redis

    this.runId = runId
    this.emitter = emitter
  }

  async execute() {
    const redis = this.redis
    const jobId = this.jobId
    const emitter = this.emitter
    const nowTimestamp = Date.now()

    const taskDataStr = await redis.hget('store:task:jobs', jobId)
    const locked = await redis.get(`store:task:lock:${jobId}`)
    if (locked || !taskDataStr) {
      return false
    }
    const taskData = JSON.parse(taskDataStr)
    if (taskData.nextRunAt && taskData.nextRunAt > nowTimestamp) {
      return false
    }

    await redis.setex(`store:task:lock:${jobId}`, 600, Date.now())
    taskData.lastRunAt = nowTimestamp
    taskData.nextRunAt = nowTimestamp - 5 + taskData.interval * 1000
    taskData.locked = true

    await redis.hset('store:task:jobs', jobId, JSON.stringify(taskData))
    emitter.emit('update job', jobId, {
      lastRunAt: nowTimestamp,
      nextRunAt: nowTimestamp - 5 + taskData.interval * 1000,
      locked: true,
    })

    const result = await this.handler.execute().then(data => {
      taskData.locked = false
      redis.hset('store:task:jobs', jobId, JSON.stringify(taskData))
      redis.del(`store:task:lock:${jobId}`)
      emitter.emit('update job', jobId, {
        locked: false,
      })

      return data
    }).catch((err) => {
      redis.del(`store:task:lock:${jobId}`)
      return err
    })
    return result
  }
}

const generateUniqueId = () => {
  const time = ~~(Date.now() / 1000)

  const pid =
    (typeof process === 'undefined' || process.pid === 1
      ? Math.floor(Math.random() * 100000)
      : process.pid) % 0xffff

  const inc = parseInt(Math.random() * 1000000)
  // Math.random().toString(36).substr(2, 6)

  var buffer = Buffer.from(12) // new Buffer(12)
  // Encode time
  buffer[3] = time & 0xff
  buffer[2] = (time >> 8) & 0xff
  buffer[1] = (time >> 16) & 0xff
  buffer[0] = (time >> 24) & 0xff
  // Encode time
  buffer[3] = time & 0xff
  buffer[2] = (time >> 8) & 0xff
  buffer[1] = (time >> 16) & 0xff
  buffer[0] = (time >> 24) & 0xff
  // Encode machine
  buffer[6] = MACHINE_ID & 0xff
  buffer[5] = (MACHINE_ID >> 8) & 0xff
  buffer[4] = (MACHINE_ID >> 16) & 0xff
  // Encode pid
  buffer[8] = pid & 0xff
  buffer[7] = (pid >> 8) & 0xff
  // Encode index
  buffer[11] = inc & 0xff
  buffer[10] = (inc >> 8) & 0xff
  buffer[9] = (inc >> 16) & 0xff
  // Return the buffer
  return buffer.toString('hex')
}

module.exports = exports = TaskMonitor
