const sequelize = require("../config/dbConnection")
const {DataTypes} = require("sequelize")
const companies = sequelize.define(
    "companies",{
        id:{
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        companyName:{
            type: DataTypes.STRING,
            allowNull: false
        },
        companySize:{
            type: DataTypes.INTEGER,
        },
        industry:{
            type:DataTypes.STRING
        },
        contactDetails:{
            type:DataTypes.STRING
        },
        note:{
            type:DataTypes.TEXT,
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    }
)

module.exports = companies