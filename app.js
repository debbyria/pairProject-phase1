const express = require('express')
const app = express()
const port = 3000
const Controller = require('./controllers/controller')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

app.get('/products', Controller.products)
app.get('/products/:CategoryId', Controller.byCategory)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})