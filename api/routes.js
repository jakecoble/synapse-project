import { User } from '../db/models'
import express from 'express'
import passport from 'passport'
const router = express.Router()

router.route('/users')
  .post((req, res) => {
    return User.create(req.body)
      .then(user => {
        res.status(201).json({ user })
      })
      .catch(error => {
        res.status(500).json({ error })
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
