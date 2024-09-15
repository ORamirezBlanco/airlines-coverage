import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { AirlineEntity } from './airline.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAirlineDto, UpdateAirlineDto } from './airline.dto';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;

  const mockAirlineRepository = () => ({
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
        AirlineService,
        {
          provide: getRepositoryToken(AirlineEntity),
          useValue: mockAirlineRepository(),
        },
      ],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of airlines', async () => {
      const result = [new AirlineEntity(), new AirlineEntity()];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single airline', async () => {
      const id = '1';
      const result = new AirlineEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(id)).toBe(result);
    });

    it('should throw NotFoundException if airline not found', async () => {
      const id = '1';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new airline', async () => {
      const createAirlineDto: CreateAirlineDto = { 
        name: 'Test Airline', 
        description: 'Test Description', 
        foundationDate: new Date('2000-01-01'), 
        website: 'http://test.com' 
      };
      const result = new AirlineEntity();
      jest.spyOn(repository, 'create').mockReturnValue(result);
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.create(createAirlineDto)).toBe(result);
    });


    it('should throw BadRequestException if foundationDate is not in the past', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const createAirlineDto: CreateAirlineDto = { 
        name: 'Test Airline', 
        description: 'Test Description', 
        foundationDate: tomorrow,
        website: 'https://testairline.com' 
      };

      try {
        await service.create(createAirlineDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Founding date must be in the past');
      }
    });
  });

  describe('update', () => {
    it('should update and return an airline', async () => {
      const id = '1';
      const updateAirlineDto: UpdateAirlineDto = { 
        name: 'Updated Airline', 
        description: 'Updated Description', 
        foundationDate: new Date('2000-01-01'), 
        website: 'http://updated.com' 
      };
      const result = new AirlineEntity();
      jest.spyOn(repository, 'update').mockResolvedValue({
        generatedMaps: [],
        raw: [],
        affected: 1
      } as UpdateResult);
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.update(id, updateAirlineDto)).toBe(result);
    });

    it('should throw BadRequestException if update foundationDate is not in the past', async () => {
      const id = '1';
      const updateAirlineDto: UpdateAirlineDto = { 
        foundationDate: new Date()
      };

      await expect(service.update(id, updateAirlineDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if airline not found', async () => {
      const id = '1';
      const updateAirlineDto: UpdateAirlineDto = { 
        name: 'Updated Airline', 
        foundationDate: new Date('2000-01-01') 
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(id, updateAirlineDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an airline', async () => {
      const id = '1';
      jest.spyOn(repository, 'delete').mockResolvedValue({
        raw: [],
        affected: 1
      } as DeleteResult);

      await expect(service.delete(id)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if airline not found', async () => {
      const id = '1';
      jest.spyOn(repository, 'delete').mockResolvedValue({
        raw: [],
        affected: 0
      } as DeleteResult);

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
