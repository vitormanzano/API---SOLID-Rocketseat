import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/prisma/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumbersOfCheckInsError } from "./errors/max-number-of-check-ins-error";

interface CheckInUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ) {}
    

    async execute({ userId, gymId, userLatitude, userLongitude }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError()
        };

        const distance = getDistanceBetweenCoordinates (
            { latitude: userLatitude, longitude: userLongitude},
            {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
        )

        const MAX_DISTANCE = 0.1

        if (distance > MAX_DISTANCE) {
            throw new MaxDistanceError();
        }

        const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate (
            userId,
            new Date(),
        )

        if (checkInOnSameDay) {
            throw new MaxNumbersOfCheckInsError();
        }

        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        });

        return {
            checkIn
        }
    }
}