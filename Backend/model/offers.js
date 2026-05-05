const sequelize = require("../config/dbConnection")
const {DataTypes} = require("sequelize")
const offers = sequelize.define(
    "offers",{
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
        lastDate:{
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

module.exports = offers