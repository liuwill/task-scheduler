const childProcess = require('child_process')
const path = require('path')

module.exports = {
  test: {
    execute() {
      return new Promise(function (resolve, reject) {
        const runningProcess = childProcess.fork(path.resolve('./example/child.js'), ['test', 'dev'], {
          env: process.env,
        })
        runningProcess.on('message', (m) => {
          console.log(m)
        })

        resolve()
      })
    }
  }
}
