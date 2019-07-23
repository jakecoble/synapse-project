export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'activated', Sequelize.BOOLEAN, {
      defaultValue: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'activated')
  }
};
