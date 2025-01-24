import {expect, describe, it, beforeEach, vi} from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repositories';
import { CheckInUseCase } from './check-in';
import { afterEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumbersOfCheckInsError } from './errors/max-number-of-check-ins-error';

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase


describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);

        await gymsRepository.create({
            id: 'gym-01',
            title: "JavaScript Gym",
            description: '',
            phone: '',
            latitude: new Decimal(0),
            longitude: new Decimal(0)
        })

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {
        
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));


        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })
        

        await expect( () => 
            sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: 0,
                userLongitude: 0
            })
        ).rejects.toBeInstanceOf(MaxNumbersOfCheckInsError);

    });

    it('should not be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));


        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));

    });

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push( {
            id: 'gym-02',
            title: "JavaScript Gym",
            description: '',
            phone: '',
            latitude: new Decimal(-22.9454412),
            longitude: new Decimal(-47.0286336)
        });

        await expect(() => sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -22.9424499,
            userLongitude: -47.0259637
        })).rejects.toBeInstanceOf(MaxDistanceError);
    });
});