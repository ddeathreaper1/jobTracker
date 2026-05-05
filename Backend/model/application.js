const sequelize = require("../config/dbConnection")
const {DataTypes} = require("sequelize")
const application = sequelize.define(
    "application",{
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
        applyDate:{
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
        },
        note:{
            type:DataTypes.TEXT,
        },
        status:{
            type:DataTypes.STRING,
            allowNull:false
        },
        attachments:{
            type:DataTypes.STRING
        }
    }
)

module.exports = application