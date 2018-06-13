const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const compression = require('compression')
const koaConnect = require('koa-connect')

const port = parseInt(process.env.PORT, 10) || 3001
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// const config = global.config = require('../src/configs')
const { redis } = require('./utils/connections')
const jobHandles = require('../server/jobs/index')
// const jobConfig = require('../server/jobs/config')
const TaskMonitor = require('./cron')

app.prepare()
  .then(() => {
    const server = new Koa()
    const router = new Router()
    const taskMonitor = new TaskMonitor(redis)

    // Enable gzip
    server.use(koaConnect(compression()))

    router.get('/json', async ctx => {
      ctx.body = {
        status: 0
      }
    })

    router.get('/tasks', async ctx => {
      ctx.body = {
        status: 0,
        data: await taskMonitor.listTasks()
      }
    })

    router.get('/task/reload/:id', async ctx => {
      const jobId = ctx.params.id
      await taskMonitor.reloadTask(jobId)
      ctx.body = {
        status: 0,
        data: await taskMonitor.getTaskById(jobId)
      }
    })

    router.get('/task/run/:id', async ctx => {
      const jobId = ctx.params.id

      setImmediate(() => {
        taskMonitor.executeTask(jobId)
      })
      ctx.body = {
        status: 0,
        data: await taskMonitor.getTaskById(jobId)
      }
    })

    router.get('/task/:id', async ctx => {
      const jobId = ctx.params.id
      ctx.body = {
        status: 0,
        data: await taskMonitor.getTaskById(jobId)
      }
    })

    router.get('*', async ctx => {
      await handle(ctx.req, ctx.res)
      ctx.respond = false
    })

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200
      await next()
    })

    server.use(router.routes())

    server.listen(port, (err) => {
      if (err) throw err

      try {
        taskMonitor.register('test', {
          'command': 'test',
          'id': 'test',
          'name': '处理测试消息',
          'rule': '*/1 * * * *',
          'state': 'running',
          'description': '处理测试消息 每1分钟同步一次'
        }, jobHandles.test)

        taskMonitor.start().then(() => {
          console.log([(new Date()).toISOString(), 'report', 'task monitor execute'].join('\t'))
        })
      } catch (err) { }
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
