import { Gym, User } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";


interface FetchNearbyGymsUseCaseRequest {
    userLatitude: number,
    userLongitude: number
}

// D - Dependency Inversion Principle

interface FetchNearbyGymsUseCaseResponse {
    gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
    constructor (private gymsRepository: GymsRepository) {}

    async execute ( 
        {   
            userLatitude,
            userLongitude
        } 
        : FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    
        const gyms = await this.gymsRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude
        });
        
        return {
            gyms
        }
    }
}

 