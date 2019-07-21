import { DataTypes, Model } from 'sequelize'

class Session extends Model {
  static fields = {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT
  }
}

export default Session
