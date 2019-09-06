import express from 'express'
import passport from 'passport'
const router = express.Router()

import users from './users'
import accounts from './accounts'

router.use('/users', users)

router.use('/accounts', accounts)

router.route('/sessions')
  .post(
    passport.authenticate('local'),
    (req, res) => {
      res.status(201).json({ message: 'Sesson created' })
    })

export default router
