import express from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/user.route.js';
import productRoute  from './routes/product.route.js'
import orderRoute  from './routes/order.route.js'

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/v1/user", userRoute);
app.use("/v1", productRoute);
app.use("/v1", orderRoute);




app.use((req, res, next) => {
    res.status(404).json({
        error: "Bad request"
    });
});

app.use((req, res, next) => {
    res.status(200).json({
        message: "App is running"
    });
});

export { app };
