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
  const id = uuidv4()

  customers.push({
    id,
    cpf,
    name,
    statement: []
  })

  return response.status(201).send(customers)

})

app.listen(3333)