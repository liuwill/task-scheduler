const child_process = require('child_process')
const path = require('path')

module.exports = {
  test: {
    execute() {
      return new Promise(function (resolve, reject){
        const childProcess = child_process.fork(path.resolve('../../example/child.js'), ['test', 'dev'] , {
          env: process.env,
        })
        childProcess.on('message', (m) => {
          console.log(m)
        })

        resolve()
      })
    }
  }
}
