const express = require('express')
const userRoute = require('./routes/user-route')
const ordersRoute = require('./routes/orders-routes')
const productRoute = require('./routes/product-routes')
const orderItemsRoute = require('./routes/order-items-routes')
const reviewsRoute = require('./routes/reviews-routes')
const path = require('path')
const cors = require('cors')



const app = express()
const port = 3000

app.use(cors())


// parse application/x-www-form-urlencoded
app.use(express.urlencoded())

// parse application/json
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/ECS/user", userRoute);
app.use("/api/ECS/orders", ordersRoute);
app.use("/api/ECS/products", productRoute);
app.use('/api/ECS/order-items', orderItemsRoute);
app.use('/api/ECS/reviews', reviewsRoute);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})