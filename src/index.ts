import express from "express";
import { activeUserGaugeMiddleware, histogramMiddleware, requestCountMiddleware } from "./monitoring/requestCount";
import client from "prom-client";

const app = express();

app.use(requestCountMiddleware);
app.use(activeUserGaugeMiddleware)
app.use(histogramMiddleware)

app.use(express.json());

app.get("/user", async (req, res) => {
    new Promise((resolve) => setTimeout(resolve, 5000));
    res.json({
        name: "John Doe",
        age: 25,
    });
});

app.post("/user", (req, res) => {
    const user = req.body;
    res.json({
        name: "manoj"
    });
});


app.get('/metrics', async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})

app.listen(3000);