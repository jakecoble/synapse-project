export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Users', [
      'email'
    ], {
      type: 'unique',
      name: 'unique_email'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Users', 'unique_email')
  }
};
