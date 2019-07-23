import 'dotenv/config'

import mockery from 'mockery'
import chai, { expect } from 'chai'
const should = chai.should()
import chaiHttp from 'chai-http'
import nodemailerMock from 'nodemailer-mock'

import { sequelize, User } from '../../db/models'

const email = 'test@example.com'
const password = 'testpassword'
var requester = null

chai.use(chaiHttp)

describe('User registration API', () => {
  before(async () => {
    mockery.enable({
      warnOnUnregistered: false
    })

    mockery.registerMock('nodemailer', nodemailerMock)

    let app = require('../../server.js').default
    requester = chai.request(app).keepOpen()
    await sequelize.sync({
      force: true,
      logging: false
    })
  })

  after(() => {
    mockery.deregisterAll()
    mockery.disable()
    requester.close()
  })

  it('should disallow passwords shorter than 8 characters', async () => {
    const res = await requester
          .post('/api/users')
          .send({
            email,
            password: 'short'
          })

    res.should.have.status(500)
  })

  describe('a valid user', async () => {
    var res = null

    before(async () => {
      res = await requester
        .post('/api/users')
        .send({
          email,
          password
        })
    })

    after(async () => {
      nodemailerMock.mock.reset()
      await sequelize.truncate({
        logging: false
      })
    })

    it('should create a new user', async () => {
      const user = await User.findOne({
        where: { email }
      })

      should.exist(user)
    })

    it('should send an activation email', async () => {
      const sentMail = nodemailerMock.mock.getSentMail()
      sentMail.length.should.equal(1)
    })
  })
})
