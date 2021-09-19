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

function getBalance(statement) {
  
  const balance = statement.reduce(( accumulate, operation ) => {
    const { type, amount } = operation

    if(type === 'credit') {
      return accumulate + amount
    } else {
      return accumulate - amount
    }

  }, 0)

  return balance
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
 
  return response.json(customer.statement)
})

app.get('/statement/date', (request, response) => {
  const { customer } = request
  const { date } = request.query

  const dateFormat = new Date(date + " 00:00")

  const statement = customer.statement.filter(
    (statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString()
  )

  return response.json(statement)
})

app.post('/deposit', (request, response) => {
  const { description, amount } = request.body

  const { customer } = request

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation)

  return response.status(201).send(statementOperation)
})

app.post('/withdraw', (request, response) => {
  const { customer } = request
  const { amount } = request.body

  const balance = getBalance(customer.statement)

  if(balance < amount) {
    return response.status(400).json({error:"Insufficient funds!"})
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit"
  }

  customer.statement.push(statementOperation)

  return response.status(201).send(statementOperation)

})

app.listen(3333)