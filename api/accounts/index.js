import express from 'express'
import axios from 'axios'

const router = express.Router()

import synapse from '../synapse'

const normalizeAccountNode = (node) => {
  return {
    id: node._id,
    type: node.type,
    nickname: node.info.nickname,
    balance: node.info.balance
  }
}

router.route('/')
      .get((req, res) => {
        return synapse.getUser(req.user.synapseId)
                      .then(user => {
                        return Promise.all([
                          user.getAllUserNodes({
                            type: 'DEPOSIT-US'
                          }),
                          user.getAllUserNodes({
                            type: 'IB-DEPOSIT-US'
                          })
                        ])
                      })
                      .then(results => {
                        var nodes = results.reduce((acc, curr) => acc = acc.concat(curr.data.nodes), [])
                        res.json(nodes.map(normalizeAccountNode))
                      })
                      .catch(error => {
                        console.log(error)
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
                        res.json(data.nodes.map(normalizeAccountNode))
                      })
                      .catch(error => {
                        console.log(error)
                        res.status(500).end()
                      })
      })

export default router
