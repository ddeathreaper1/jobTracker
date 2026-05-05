const sequelize = require("../config/dbConnection")
const {DataTypes} = require("sequelize")
const applyLater = sequelize.define(
    "applyLater",{
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
        applyLink:{
            type: DataTypes.STRING,
            allowNull: false
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        applied:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        }
    }
)

module.exports = applyLater