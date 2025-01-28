import {FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod";
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply)  {
    const createCheckInsParamsSchema = z.object({
        gymId: z.string().uuid()
    })

    const createCheckInBodySchema = z.object ({
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180
        })
    });

    const { gymId } = createCheckInsParamsSchema.parse(request.params);
    const {latitude, longitude} = createCheckInBodySchema.parse(request.body);

    const createGymUseCase = makeCheckInUseCase();

    await createGymUseCase.execute({gymId, userId: request.user.sub ,userLatitude: latitude, userLongitude: longitude});
 
    return reply.status(201).send();

}