const sequelize = require("../config/dbConnection")
const {DataTypes} = require("sequelize")
const interviews = sequelize.define(
    "interviews",{
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
        interviewDate:{
            type: DataTypes.DATE,
            allowNull: false
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        post:{
            type:DataTypes.STRING,
            allowNull:false
        }
    }
)

module.exports = interviews