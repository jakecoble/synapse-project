import express from 'express'
import passport from 'passport'
const router = express.Router()

import users from './users'

router.use('/users', users)

router.route('/sessions')
  .post(
    passport.authenticate('local'),
    (req, res) => {
      res.status(201).json({ message: 'Sesson created' })
    })

export default router
