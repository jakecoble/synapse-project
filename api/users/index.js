import { User, sequelize } from '../../db/models'
import express from 'express'
import ejs from 'ejs'
import path from 'path'
import nodemailer from 'nodemailer'
const router = express.Router()

import multer from 'multer'
// FIXME: Only suitable for development
const storage = multer.memoryStorage()
const upload = multer({ storage })

import synapse from '../synapse'

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

const emailTemplate = path.resolve(__dirname, 'activation-email.ejs')

router.route('/')
  .post(upload.single('photo_id'),
        (req, res) => {
          var {
            email,
            password,
            phone_number,
            first_name,
            last_name,
            dob_day,
            dob_month,
            dob_year,
            address_street,
            address_city,
            address_subdivision,
            address_postal_code,
            address_country_code,
            ssn
          } = req.body

          const encodedFile = req.file.buffer.toString('base64')
          const photo_id = `data:${req.file.mimetype};base64,${encodedFile}`

          return sequelize.transaction(t => {
            return User.create(
              {
                email,
                password
              },
              { transaction: t }
            ).then(user => {
              return synapse.createUser({
                logins: [
                  {
                    email
                  }
                ],

                phone_numbers: [
                  phone_number
                ],

                legal_names: [
                  first_name + ' ' + last_name
                ],

                documents: [
                  {
                    email,
                    phone_number,
                    ip: '::1',
                    name: first_name + ' ' + last_name,
                    entity_type: 'M',
                    entity_scope: 'Arts & Entertainment',
                    day: parseInt(dob_day),
                    month: parseInt(dob_month),
                    year: parseInt(dob_year),
                    address_street,
                    address_city,
                    address_subdivision,
                    address_postal_code,
                    address_country_code,
                    virtual_docs: [
                      {
                        document_value: ssn,
                        document_type: 'SSN'
                      }
                    ],
                    physical_docs: [
                      {
                        document_value: photo_id,
                        document_type: 'GOVT_ID'
                      }
                    ]
                  }
                ]
              },
              '127.0.0.1')
                .then(({ id }) => {
                  return user.update({
                    synapseId: id
                  }, { transaction: t })
                })
            })
          })
            // We're forgetting about email activation to make things simpler for now.
            // .then((user) => {
            //   return ejs.renderFile(emailTemplate, {
            //     activateUrl: `${req.protocol}://${req.hostname}/users/activate/${user.activationKey}`
            //   }).then(template => {
            //     return mailer.sendMail({
            //       from: process.env.NM_FROM,
            //       to: user.email,
            //       subject: 'Account Activation',
            //       html: template
            //     })
            //   })
            // })
            .then(() => {
              return res.status(201).json({ message: 'Account created' })
            })
            .catch(error => {
              console.log(error)
              res.status(500).end()
            })
        })

router.get('/activate/:activationKey', (req, res) => {
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

export default router
