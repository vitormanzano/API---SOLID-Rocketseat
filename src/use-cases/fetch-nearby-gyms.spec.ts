import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -22.9424499,
            longitude: -47.0259637
        });

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -22.733366,
            longitude: -47.1785769
        });

        const { gyms } = await sut.execute({
                userLatitude: -22.9424499,
                userLongitude: -47.0259637
            });

            expect(gyms).toHaveLength(1);
            expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym'})])

        })
});