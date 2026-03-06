# Project: nv-Customer

This project is a variation of the nv-webblog68 project, extended with a new model: **Customer**.

## New Model: Customer

### Schema
- **firstName**: STRING\n- **lastName**: STRING\n- **email**: STRING\n- **phone**: STRING\n- **address**: TEXT

## New Controller
A dedicated controller `CustomerController` has been added to handle CRUD operations for `Customer`.

## New Routes
The following routes have been added to `server/src/routes.js`:

- **GET** `/customers` - Get all customers
- **POST** `/customer` - Create a new customer
- **GET** `/customer/:customerId` - Get a customer by ID
- **PUT** `/customer/:customerId` - Update a customer
- **DELETE** `/customer/:customerId` - Delete a customer

## Usage
Follow standard setup instructions for Client and Server.
