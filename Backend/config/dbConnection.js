const {Sequelize} = require("sequelize")

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
});


(async ()=>{
    try {
    await sequelize.authenticate()
    console.log("Database is connected")   
    } catch (error) {
        console.log(error)
    }
})()


module.exports = sequelize