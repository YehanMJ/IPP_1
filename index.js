const express = require('express')
const userRoute = require('./routes/user-route')
const ordersRoute = require('./routes/orders-routes')
const productRoute = require('./routes/product-routes')



const app = express()
const port = 3000
// parse application/x-www-form-urlencoded
app.use(express.urlencoded())

// parse application/json
app.use(express.json())

app.use("/api/ECS/user", userRoute);
app.use("/api/ECS/orders", ordersRoute);
app.use("/api/ECS/products", productRoute);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})