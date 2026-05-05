const User = require("./user")
const Interview = require("./interview")
const Application = require("./application")
const Offers = require("./offers")
const Notes = require("./notes")
const Companies = require("./companies")
const ApplyLater = require("./applyLater")

User.hasMany(Interview,{foreignKey:"userId"})
Interview.belongsTo(User,{foreignKey:"userId"})

User.hasMany(Application,{foreignKey:"userId"})
Application.belongsTo(User,{foreignKey:"userId"})

User.hasMany(Offers,{foreignKey:"userId"})
Offers.belongsTo(User,{foreignKey:"userId"})


User.hasMany(Notes, {foreignKey:"userId"})
Notes.belongsTo(User,{foreignKey:"userId"})

User.hasMany(Companies, {foreignKey:"userId"})
Companies.belongsTo(User,{foreignKey:"userId"})

User.hasMany(ApplyLater,{foreignKey:"userId"})
ApplyLater.belongsTo(User,{foreignKey:"userId"})

module.exports = {User, Interview, Application, Offers, Notes, Companies, ApplyLater}