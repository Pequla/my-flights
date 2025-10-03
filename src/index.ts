import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from "dotenv"
import { AppDataSource } from './db'
import { notFoundResponse } from './utils'
import userRoute from './routes/user.route'
import flightRoute from './routes/flight.route'

// Setting up web server
const app = express()
app.use(express.json())
app.use(morgan('combined'))
app.use(cors())
app.use((req, res, next) => {
    const xfr = req.headers['X-Forwarded-For']
    if (xfr)
        console.log('Requested by: ' + xfr)

    next()
})

// Reading env variables
dotenv.config();
const port = process.env.SERVER_PORT;

// Connect to database
AppDataSource.initialize()
    .then(() => {
        console.log('Connected to database');
        app.listen(port, () => console.log(`Listening on port ${port}`));
    })
    .catch((error) => console.log(error))

// Route setup
app.use('/api/flight', flightRoute);
app.use('/api/user', userRoute);

// Default not found page
app.use((req, res, next) => {
    notFoundResponse(res);
})

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});