const express = require('express')
const { v4: uuidv4 } = require('uuid')
 
const app = express()
app.use(express.json())

const customers = [];

// Middleware

function verifyAccountCPF(request, response, next) {
  const { cpf } = request.headers

  const customer = customers.find((customer) => customer.cpf === cpf)

  if(!customer) { 
    return response.status(401).json({error:"Customer does not exists!"})
  }

  request.customer = customer

  return next()
}

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


app.use(verifyAccountCPF)

app.get('/statement', (request, response) => {

  const { customer } = request
 
  console.log(customers, customer)

  return response.json(customer.statement)
})

app.listen(3333)