const { Sequelize } = require('sequelize')


const sequelize = new Sequelize('store', 'root', '12345678', {
    dialect: 'mysql',
    host: 'localhost'
})


module.exports = sequelize