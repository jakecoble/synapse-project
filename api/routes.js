import express from 'express'
import passport from 'passport'
const router = express.Router()

import synapse from './synapse'

import users from './users'
import accounts from './accounts'

router.use('/users', users)

router.use('/accounts', accounts)

router.route('/sessions')
  .post(
    passport.authenticate('local'),
    (req, res) => {
      return synapse.getUser(req.user.synapseId)
                    .then(({ body }) => {
                      res.json({
                        id: body._id,
                        name: body.legal_names[0]
                      })
                    })
                    .catch(error => console.log(error))
    })

export default router
