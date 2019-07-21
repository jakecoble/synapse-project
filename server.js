import path from 'path'
import express from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import session from 'express-session'

import { sequelize, User } from './db/models'
import api from './api/routes.js'

const SequelizeStore = require('connect-session-sequelize')(session.Store)
const app = express()

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack')
  const webpackMiddleware = require('webpack-dev-middleware')
  const webpackConfig = require('./config/webpack.dev.js')

  const webpackCompiler = webpack(webpackConfig)
  app.use(webpackMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath
  }))

  app.use(require('webpack-hot-middleware')(webpackCompiler))
}

app.use(express.static(__dirname))
app.use(express.json())

function extendDefaultFields (defaults, session) {
  let userId = session.passport ? session.passport.user : null

  return {
    data: defaults.data,
    expires: defaults.expires,
    userId
  }
}

app.use(session({
  secret: 'keyboard cat',
  store: new SequelizeStore({
    db: sequelize,
    table: 'Session',
    extendDefaultFields
  }),
  resave: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  (email, password, done) => {
    User.findOne({
      where: { email }
    })
      .then(user => {
        if (!user) {
          done(null, false, { message: 'Invalid email' })
        } else if (user.validPassword(password)) {
          done(null, user)
        } else {
          done(null, false, { message: 'Invalid password' })
        }
      })
      .catch(err => done(err))
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  return User.findByPk(id)
    .then(user => {
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch(err => done(err))
})

app.use('/api', api)

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`)
  console.log('Press Ctrl+C to quit.')
})
