import request from 'supertest'
import { app } from  '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe(' Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close()
    });

    it('should be able to list nearby gyms', async () => {
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
            latitude: -22.733366,
            longitude: -47.1785769
        });

        const response = await request(app.server).get('/gyms/nearby')
            .query({
                latitude: -22.9424499,
                longitude: -47.0259637
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