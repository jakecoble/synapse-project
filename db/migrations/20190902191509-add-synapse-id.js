export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'synapseId', Sequelize.STRING, {
      unique: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'synapseId')
  }
}
