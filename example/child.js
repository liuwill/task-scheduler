const argv = process.argv.slice(2)
console.log((new Date()).toISOString(), 'test task', JSON.stringify(argv))
