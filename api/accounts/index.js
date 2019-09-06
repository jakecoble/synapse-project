import express from 'express'
import axios from 'axios'

const router = express.Router()

import synapse from '../synapse'

router.route('/')
      .get((req, res) => {
        return synapse.getUser(req.user.synapseId)
                      .then(user => {
                        return user.getAllUserNodes()
                      })
                      .then(({ data }) => {
                        res.json(data)
                      })
                      .catch(() => {
                        res.status(500).end()
                      })
      })
      .post((req, res) => {
        var {
          nickname,
          checking
        } = req.body

        var type = checking ? 'DEPOSIT-US' : 'IB-DEPOSIT-US'

        return synapse.getUser(req.user.synapseId)
                      .then(user => {
                        return user.createNode({
                          type,
                          info: {
                            nickname,
                            document_id: user.body.documents[0].id
                          }
                        })
                      })
                      .then(({ data }) => {
                        res.json(data)
                      })
                      .catch(error => {
                        res.status(500).end()
                      })
      })

export default router
