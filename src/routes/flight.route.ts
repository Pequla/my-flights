import { Router } from "express";
import { authenticateToken, checkIfDefined, sendErrorResponse } from "../utils";
import { FlightService } from "../services/flight.service";

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const data = checkIfDefined(await FlightService.getUserFlights((req as any).user.name), res);
        res.json(data)
    } catch (e) {
        sendErrorResponse(res, 400, e.message);
    }
})

router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const email = (req as any).user.name;
        const flight = (req.params.id) as any as number;
        const data = checkIfDefined(await FlightService.saveUserFlight(email, flight), res);
        res.json(data)
    } catch (e) {
        sendErrorResponse(res, 400, e.message);
    }
})

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const email = (req as any).user.name;
        const flight = (req.params.id) as any as number;
        const data = checkIfDefined(await FlightService.deleteUserFlight(email, flight), res);
        res.json(data)
    } catch (e) {
        sendErrorResponse(res, 400, e.message);
    }
})

export = router