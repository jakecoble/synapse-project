import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { DataTypes, Model } from 'sequelize'

function hashPassword (user) {
  if (user.changed('password')) {
    return bcrypt.hash(user.password, 12)
      .then(hash => user.password = hash)
  }
}

function genActivationKey (user) {
  var hash = crypto.createHash('sha1')

  user.activationKey = hash.update(user.email).digest('hex')
}

class User extends Model {
  static fields = {
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8, undefined]
      }
    },

    synapseId: {
      type: DataTypes.STRING,
      unique: true
    },

    activationKey: DataTypes.STRING,
    activated: DataTypes.BOOLEAN
  }

  static hooks = {
    beforeCreate: [
      hashPassword,
      genActivationKey
    ],
    beforeUpdate: hashPassword
  }

  static associate (models) {
    this.hasMany(models.Session, {
      foreignKey: 'userId'
    })
  }

  static authenticate () {
    return (email, password, done) => {
      this.findOne({ email })
        .then(user => user.validPassword(password))
        .then()
    }
  }

  validPassword (password) {
    return bcrypt.compare(password, this.password)
  }
}

export default User
