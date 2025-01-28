import request from 'supertest'
import { app } from  '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close()
    });

    it('should be able to search gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        await request(app.server).post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some Description',
                phone: '1234567891',
                latitude: -22.9424499,
                longitude: -47.0259637
            });

        await request(app.server).post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Typescript Gym',
            description: 'Some Description',
            phone: '1234567891',
            latitude: -22.9424499,
            longitude: -47.0259637
        });

        const response = await request(app.server).get('/gyms/search')
            .query({
                q: 'JavaScript',
            })
            .set('Authorization', `Bearer ${token}`)
            .send()
        
        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym'
            })
        ]);
    });
})