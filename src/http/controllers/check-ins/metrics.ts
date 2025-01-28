import {FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod";
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case';
import { makeGetUserMetricsProfileUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';

export async function metrics(request: FastifyRequest, reply: FastifyReply)  {
    const getUserMetricsUseCase = makeGetUserMetricsProfileUseCase();

    const { checkInsCount } =  await getUserMetricsUseCase.execute({
        userId: request.user.sub,
    }
        
    );
     
    return reply.status(200).send({
        checkInsCount
    });

}