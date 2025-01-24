import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/prisma/check-ins-repository";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateUseCaseRequest {
    checkInId: string    
}

interface ValidateUseCaseResponse {
    checkIn: CheckIn
}

export class ValidateCheckInUseCase {
    constructor(
        private checkInRepository: CheckInsRepository,
    ) {}
    

    async execute({ checkInId }: ValidateUseCaseRequest): Promise<ValidateUseCaseResponse> {
        const checkIn = await this.checkInRepository.findById(checkInId);

        if (!checkIn) {
            throw new ResourceNotFoundError();
        };

        const distanceInMinutosFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes'
        );

        if (distanceInMinutosFromCheckInCreation > 20) {
            throw new LateCheckInValidationError();
        }

        checkIn.is_validated = new Date();

        await this.checkInRepository.save(checkIn);

        return {
            checkIn
        }
    }
}