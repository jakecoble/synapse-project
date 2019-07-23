export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'activationKey', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'activationKey')
  }
};
