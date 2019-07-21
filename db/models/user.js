import bcrypt from 'bcrypt'
import { DataTypes, Model } from 'sequelize'

function hashPassword (user) {
  if (user.changed('password')) {
    return bcrypt.hash(user.password, 12)
      .then(hash => user.password = hash)
  }
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
    }
  }

  static hooks = {
    beforeCreate: hashPassword,
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
