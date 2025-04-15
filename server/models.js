const sequelize = require('./db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hhid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
})

const Vacancy = sequelize.define('vacancy', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hhid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
})

const Employer = sequelize.define('vacancy', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hhid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
})

const Area = sequelize.define('vacancy', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hhid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
})

Vacancy.hasOne(Employer)
Employer.hasMany(Vacancy)

Area.hasMany(Vacancy)
Vacancy.hasOne(Area)

module.exports = {
    User,
    Vacancy,
    Employer,
    Area
}