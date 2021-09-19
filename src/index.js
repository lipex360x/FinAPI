const express = require('express')
const { v4: uuidv4 } = require('uuid')
 
const app = express()
app.use(express.json())

const customers = [];

/**
 * cpf: string
 * name: string
 * id: uuid
 * statement: []
 */
app.post('/account', (request, response) => {
  const { name, cpf } = request.body

  const getCustomer = customers.some((customer) => customer.cpf === cpf)

  if(getCustomer) {
    return response.status(400).json({error: "Customer already exists!"})
  }

  customers.push({
    id: uuidv4(),
    cpf,
    name,
    statement: []
  })

  return response.status(201).send(customers)

})

app.listen(3333)