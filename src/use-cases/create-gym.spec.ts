import {expect, describe, it, beforeEach, vi} from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsRepository);
        });
 
    it('should be able to create gym', async () => {
        
        const { gym } = await sut.execute({
            title: 'Javascript Gym',
            description: null,
            phone: null,
            latitude: -22.9424499,
            longitude: -47.0259637
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});