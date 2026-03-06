module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT
  })
  return Customer
}
