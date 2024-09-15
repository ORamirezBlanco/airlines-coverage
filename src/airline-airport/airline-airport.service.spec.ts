import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;

  const mockAirlineRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  });

  const mockAirportRepository = () => ({
    findOne: jest.fn(),
    findByIds: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirlineAirportService,
        { provide: getRepositoryToken(AirlineEntity), useFactory: mockAirlineRepository },
        { provide: getRepositoryToken(AirportEntity), useFactory: mockAirportRepository },
      ],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    airportRepository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
  });

  describe('addAirportToAirline', () => {
    it('should add an airport to an airline', async () => {
      const airline = new AirlineEntity();
      const airport = new AirportEntity();
      airline.airports = [];

      airlineRepository.findOne = jest.fn().mockResolvedValue(airline);
      airportRepository.findOne = jest.fn().mockResolvedValue(airport);
      airlineRepository.save = jest.fn().mockResolvedValue(airline);

      const result = await service.addAirportToAirline('1', '1');
      expect(result.airports).toContain(airport);
      expect(airlineRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if airline not found', async () => {
      airportRepository.findOne = jest.fn().mockResolvedValue(new AirportEntity());
      airlineRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.addAirportToAirline('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if airport not found', async () => {
      const airline = new AirlineEntity();
      airlineRepository.findOne = jest.fn().mockResolvedValue(airline);
      airportRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.addAirportToAirline('1', '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return all airports from an airline', async () => {
      const airline = new AirlineEntity();
      const airport1 = new AirportEntity();
      const airport2 = new AirportEntity();
      airline.airports = [airport1, airport2];

      airlineRepository.findOne = jest.fn().mockResolvedValue(airline);

      const result = await service.findAirportsFromAirline('1');
      expect(result).toEqual([airport1, airport2]);
    });

    it('should throw NotFoundException if airline not found', async () => {
      airlineRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findAirportsFromAirline('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAirportFromAirline', () => {
    it('should return an airport for the given airline', async () => {
      const airline = new AirlineEntity();
      const airport = new AirportEntity();
      airport.id = '2';
      airline.airports = [airport];

      airlineRepository.findOne = jest.fn().mockResolvedValue(airline);

      const result = await service.findAirportFromAirline('1', '2');
      expect(result).toEqual(airport);
    });

    it('should throw NotFoundException if airline not found', async () => {
      airlineRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findAirportFromAirline('1', '2')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if airport not found for the airline', async () => {
      const airline = new AirlineEntity();
      airline.airports = [];

      airlineRepository.findOne = jest.fn().mockResolvedValue(airline);

      await expect(service.findAirportFromAirline('1', '2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should remove an airport from an airline', async () => {
      const airline = new AirlineEntity();
      const airport = new AirportEntity();
      airport.id = '2';
      airline.airports = [airport];

      airlineRepository.findOne = jest.fn().mockResolvedValue(airline);
      airlineRepository.save = jest.fn().mockResolvedValue(airline);

      const result = await service.deleteAirportFromAirline('1', '2');
      expect(result.airports).not.toContain(airport);
    });

    it('should throw NotFoundException if airline not found', async () => {
      airlineRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.deleteAirportFromAirline('1', '2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should update the airports for the given airline', async () => {
      const airline = new AirlineEntity();
      const airport1 = new AirportEntity();
      const airport2 = new AirportEntity();
      const airportIds = [airport1.id, airport2.id];
      airline.airports = [];

      airlineRepository.findOne = jest.fn().mockResolvedValue(airline);
      airportRepository.findByIds = jest.fn().mockResolvedValue([airport1, airport2]);
      airlineRepository.save = jest.fn().mockResolvedValue(airline);

      const result = await service.updateAirportsFromAirline('1', airportIds);
      expect(result.airports).toEqual([airport1, airport2]);
    });

    it('should throw NotFoundException if airline not found', async () => {
      airportRepository.findByIds = jest.fn().mockResolvedValue([new AirportEntity()]);
      airlineRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.updateAirportsFromAirline('1', ['2'])).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if one or more airports are not found', async () => {
      const airline = new AirlineEntity();
      airline.airports = [];

      airlineRepository.findOne = jest.fn().mockResolvedValue(airline);
      airportRepository.findByIds = jest.fn().mockResolvedValue([new AirportEntity()]); 

      await expect(service.updateAirportsFromAirline('1', ['1', '2'])).rejects.toThrow(BadRequestException);
    });
  });
});
