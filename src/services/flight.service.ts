import axios from "axios";
import { AppDataSource } from "../db";
import { UserFlight } from "../entities/UserFlight";
import { UserService } from "./user.service";
import { FlightModel } from "../models/flight.model";

const repo = AppDataSource.getRepository(UserFlight)

export class FlightService {

    public static async getUserFlights(email: string): Promise<FlightModel[]> {
        const currentUser = await UserService.findByEmail(email);
        if (currentUser == undefined) throw new Error("No user found")

        const data = await repo.find({
            where: {
                userId: currentUser.userId
            }
        })

        // Extract only flight ids from the whole object
        const ids = data.map(flight =>
            flight.flightId
        )

        // Retrieve flights from the api
        const rsp = await axios.request({
            url: 'https://flight.pequla.com/api/flight/list',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: ids
        })

        // Return array of flights
        return rsp.data;
    }

    public static async saveUserFlight(email: string, flight: number) {
        const currentUser = await UserService.findByEmail(email);
        if (currentUser == undefined) throw new Error("No user found")

        const data = await repo.findOne({
            where: {
                userId: currentUser.userId,
                flightId: flight
            }
        })

        if (data)
            throw new Error('Flight already saved')

        return await repo.save({
            userId: currentUser.userId,
            flightId: flight
        })
    }

    public static async deleteUserFlight(email: string, flight: number) {
        const currentUser = await UserService.findByEmail(email);
        if (currentUser == undefined) throw new Error("No user found")

        const data = await repo.findOne({
            where: {
                userId: currentUser.userId,
                flightId: flight
            }
        })

        if (data)
            return await repo.delete(data.userFlightId)

        throw new Error("You cant delete other user's flights")
    }
}