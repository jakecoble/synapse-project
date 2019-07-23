import { User } from '../db/models'
import express from 'express'
import passport from 'passport'
import ejs from 'ejs'
import path from 'path'
import nodemailer from 'nodemailer'
const router = express.Router()

const mailer = nodemailer.createTransport({
  host: process.env.NM_HOST,
  port: process.env.NM_PORT,
  secure: false,
  auth: {
    user: process.env.NM_USER,
    pass: process.env.NM_PASS
  },
  logger: false,
  debug: false
})

const emailTemplate = path.resolve(__dirname, 'email.ejs')

router.route('/users')
  .post((req, res) => {
    return User.create(req.body)
      .then(user => {
        return ejs.renderFile(emailTemplate, {
          activateUrl: `${req.protocol}://${req.hostname}/users/activate/${user.activationKey}`
        }).then(template => {
          return mailer.sendMail({
            from: process.env.NM_FROM,
            to: user.email,
            subject: 'Account Activation',
            html: template
          })
        })
      })
      .then(() => {
        res.status(201).json({ message: 'Email sent'})
      })
      .catch(error => {
        res.status(500).json({ error })
      })
  })

router.get('/users/activate/:activationKey', (req, res) => {
  return User.findOne({
      where: {
        activationKey: req.params.activationKey
      }
    })
    .then(user => {
      if (user.activated) {
        res.json({ message: 'This account has already been activated.' })
      } else {
        user.activated = true
        return user.save()
      }
    })
    .then(() => {
      res.json({ message: 'Account activated. You can now log in.' })
    })
    .catch(err => {
      res.json({ error: err })
    })
})

router.route('/sessions')
  .post(
    passport.authenticate('local'),
    (req, res) => {
      res.status(201).json({ message: 'Sesson created' })
    })

router.route('/test')
  .get(
    (req, res) => {
      res.status(200).json({ user: req.user })
    })

export default router
