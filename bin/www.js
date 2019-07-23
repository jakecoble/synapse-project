import app from '../server.js'

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
  console.log('Press Ctrl+C to quit.')
})
