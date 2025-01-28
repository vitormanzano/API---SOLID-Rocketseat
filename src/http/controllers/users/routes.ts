import { FastifyInstance } from 'fastify';
import {register} from './register'
import { authenticate } from './authenticate';
import { profile } from './profile';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { refresh } from './refresh';

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', register);
    app.post('/sessions', authenticate);

    app.patch('/token/refresh', refresh); //Quando o usuario perder a autenticacao

    /* Authenticated User */
    app.get('/me', {onRequest: [verifyJWT] } ,profile)
}
