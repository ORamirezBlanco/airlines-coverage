import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { AirportEntity } from './airport.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAirportDto, UpdateAirportDto } from './airport.dto';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;

  const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirportService,
        { provide: getRepositoryToken(AirportEntity), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
  });

  describe('findAll', () => {
    it('should return an array of airports', async () => {
      const result = [new AirportEntity()];
      repository.find = jest.fn().mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an airport by ID', async () => {
      const id = '1';
      const result = new AirportEntity();
      repository.findOne = jest.fn().mockResolvedValue(result);

      expect(await service.findOne(id)).toBe(result);
    });

    it('should throw NotFoundException if airport not found', async () => {
      const id = '1';
      repository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`Airport with ID ${id} not found`)
      );
    });
  });

  describe('create', () => {
    it('should create and return a new airport', async () => {
      const createAirportDto: CreateAirportDto = {
        name: 'Airport Name',
        code: 'ABC',
        country: 'Country',
        city: 'City',
      };
      const result = new AirportEntity();
      repository.create = jest.fn().mockReturnValue(result);
      repository.save = jest.fn().mockResolvedValue(result);

      expect(await service.create(createAirportDto)).toBe(result);
    });

    it('should throw BadRequestException if airport code is not 3 characters long', async () => {
      const createAirportDto: CreateAirportDto = { 
        name: 'Test Airport', 
        code: 'AB', // Invalid code length
        country: 'Test Country', 
        city: 'Test City' 
      };

      try {
        await service.create(createAirportDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Airport code must be exactly 3 characters long');
      }
    });
  });

  describe('update', () => {
    it('should update and return an airport', async () => {
      const id = '1';
      const updateAirportDto: UpdateAirportDto = {
        name: 'Updated Airport Name',
        code: 'XYZ',
        country: 'Updated Country',
        city: 'Updated City',
      };
      const result = new AirportEntity();
      repository.update = jest.fn().mockResolvedValue(undefined);
      repository.findOne = jest.fn().mockResolvedValue(result);

      expect(await service.update(id, updateAirportDto)).toBe(result);
    });

    it('should throw BadRequestException if airport code is not 3 characters long', async () => {
      const id = '1';
      const updateAirportDto: UpdateAirportDto = {
        name: 'Updated Airport Name',
        code: 'AB',
        country: 'Updated Country',
        city: 'Updated City',
      };

      await expect(service.update(id, updateAirportDto)).rejects.toThrow(
        new BadRequestException('Airport code must be exactly 3 characters long')
      );
    });

    it('should throw NotFoundException if airport not found after update', async () => {
      const id = '1';
      const updateAirportDto: UpdateAirportDto = {
        name: 'Updated Airport Name',
        code: 'XYZ',
        country: 'Updated Country',
        city: 'Updated City',
      };
      repository.update = jest.fn().mockResolvedValue(undefined);
      repository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.update(id, updateAirportDto)).rejects.toThrow(
        new NotFoundException(`Airport with ID ${id} not found`)
      );
    });
  });

  describe('delete', () => {
    it('should delete an airport by ID', async () => {
      const id = '1';
      const result = { affected: 1 };
      repository.delete = jest.fn().mockResolvedValue(result);

      await expect(service.delete(id)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if airport to delete is not found', async () => {
      const id = '1';
      const result = { affected: 0 };
      repository.delete = jest.fn().mockResolvedValue(result);

      await expect(service.delete(id)).rejects.toThrow(
        new NotFoundException(`Airport with ID ${id} not found`)
      );
    });
  });
});
