const sequelize = require("../config/dbConnection")
const {DataTypes} = require("sequelize")
const users = sequelize.define(
    "users",{
        id:{
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            unique:true,
            allowNull: false
        },
        phoneno:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        password:{
            type: DataTypes.STRING
        }
    }
)

module.exports = users