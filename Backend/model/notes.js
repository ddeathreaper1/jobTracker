const sequelize = require("../config/dbConnection")
const {DataTypes} = require("sequelize")
const notes = sequelize.define(
    "notes",{
        id:{
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        content:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        completed:{
            type:DataTypes.BOOLEAN,
            allowNull: false
        }
    }
)

module.exports = notes