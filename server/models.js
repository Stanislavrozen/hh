// backend/src/models.js
const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hhid: { type: DataTypes.INTEGER, allowNull: false }
});

const Vacancy = sequelize.define('vacancy', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hhid: { type: DataTypes.INTEGER, allowNull: false }
});

const Employer = sequelize.define('employer', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hhid: { type: DataTypes.INTEGER, allowNull: false }
});

const Area = sequelize.define('area', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hhid: { type: DataTypes.INTEGER, allowNull: false }
});

const SearchLog = sequelize.define('searches', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    found: { type: DataTypes.INTEGER },
    time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

// Associations
Vacancy.hasOne(Employer);
Employer.hasMany(Vacancy);

Area.hasMany(Vacancy);
Vacancy.hasOne(Area);

module.exports = {
    User,
    Vacancy,
    Employer,
    Area,
    SearchLog
};