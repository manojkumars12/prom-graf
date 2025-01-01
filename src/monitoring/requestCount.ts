import { Request, Response, NextFunction } from "express";
import client from "prom-client";

const requestCount = new client.Counter({
    name: "http_requests_total",
    help: "displays total number of request",
    labelNames: ["method", "route", "status_code"]
})

export const requestCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const endTime = Date.now();
        requestCount.inc({
            method: req.method,
            route: req.route? req.route.path : req.path,
            status_code: res.statusCode
        })
    })
    next();
}


const activeUserGauge = new client.Gauge({
    name: "active_users",
    help: "Total number of users whose request hasnt been resolved",
    labelNames: ["method", "route", "status_code"]
}) 

export function activeUserGaugeMiddleware(req: Request, res: Response, next: NextFunction) {
    activeUserGauge.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode
    })

    res.on('finish', () => {
        activeUserGauge.dec({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        })
    })
    next();
}