const express = require("express")
require("dotenv").config()
const eventRouter = require("./routes/event")
const authRouter = require("./routes/auth")
const bookingRouter = require("./routes/bookings")
const connect = require("./utils/dbConfig")
const swaggerSetup = require('./utils/swagger')

const app = express() 
const port = process.env.PORT || 3000;
swaggerSetup(app);

//middlewares
app.use(express.json())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/events', eventRouter)
app.use('/api/bookings', bookingRouter)

app.listen(port, async () => { 
    console.log(`Server running on port ${port}`);

    await connect() 
  });


//   77dHSqn1TOIEPnGo