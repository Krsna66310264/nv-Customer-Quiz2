const { Customer } = require('../models')

module.exports = {
  // get all customer
  async index (req, res) {
    try {
      const customers = await Customer.findAll()
      res.send(customers)
    } catch (err) {
      res.status(500).send({
        error: 'The customers information was incorrect'
      })
    }
  },

  // create customer
  async create (req, res) {
    try {
      const customer = await Customer.create(req.body)
      res.send(customer.toJSON())
    } catch (err) {
      res.status(500).send({
        error: 'Create customer incorrect'
      })
    }
  },

  // edit customer, suspend, active
  async put (req, res) {
    try {
      await Customer.update(req.body, {
        where: {
          id: req.params.customerId
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'Update customer incorrect'
      })
    }
  },

  // delete customer
  async remove (req, res) {
    try {
      const customer = await Customer.findOne({
        where: {
          id: req.params.customerId
        }
      })

      if (!customer) {
        return res.status(403).send({
          error: 'The customer information was incorrect'
        })
      }

      await customer.destroy()
      res.send(customer)
    } catch (err) {
      res.status(500).send({
        error: 'The customer information was incorrect'
      })
    }
  },

  // get customer by id
  async show (req, res) {
    try {
      const customer = await Customer.findByPk(req.params.customerId)
      res.send(customer)
    } catch (err) {
      res.status(500).send({
        error: 'The customer information was incorrect'
      })
    }
  }
}
