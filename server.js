import 'dotenv/config'

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
  resave: false,
  saveUninitialized: false
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
          return done(null, false, { message: 'Invalid email' })
        } else if (user.validPassword(password)) {
          return done(null, user)
        } else {
          if (user.activated) {
            return done(null, false, { message: 'Invalid password' })
          } else {
            return done(null, false, { message: 'This account has not yet been activated.' })
          }
        }
      })
      .catch(err => done(err))
  }
))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  return User.findByPk(id)
    .then(user => {
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    })
    .catch(err => done(err))
})

app.use('/api', api)

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

export default app
