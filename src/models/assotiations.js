const Filters = require('./filters.model')
const User = require('./user.model')

User.hasOne(Filters, {
    foreighKey: 'userId'
})
Filters.belongsTo(User, {
    foreighKey: 'userId'
})
module.exports = {
    Filters,
    User
}