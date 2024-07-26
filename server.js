const express = require('express');
const app = express();
const dotenv = require('dotenv');
const database = require('./database/db');
const userRoute = require('./routes/user.route');
const carRoute = require('./routes/car.route');
const cors = require('cors');


dotenv.config();
const PORT = process.env.PORT || 1000;

database.connect();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/api/v1/auth/", userRoute);
app.use("/api/v1/cardetails/", carRoute);


app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})

