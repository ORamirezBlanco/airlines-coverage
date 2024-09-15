import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AirlineEntity } from "../airline/airline.entity";
import { AirportEntity } from "../airport/airport.entity";

@Injectable()
export class AirlineAirportService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,

    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>
  ) {}

  async addAirportToAirline(
    airlineId: string,
    airportId: string
  ): Promise<AirlineEntity> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ["airports"],
    });
    const airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });

    if (!airline) {
      throw new NotFoundException(`Airline with ID ${airlineId} not found`);
    }
    if (!airport) {
      throw new NotFoundException(`Airport with ID ${airportId} not found`);
    }

    airline.airports = [...airline.airports, airport];
    return this.airlineRepository.save(airline);
  }

  async findAirportsFromAirline(airlineId: string): Promise<AirportEntity[]> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ["airports"],
    });
    if (!airline) {
      throw new NotFoundException(`Airline with ID ${airlineId} not found`);
    }
    return airline.airports;
  }

  async findAirportFromAirline(
    airlineId: string,
    airportId: string
  ): Promise<AirportEntity> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ["airports"],
    });
    if (!airline) {
      throw new NotFoundException(`Airline with ID ${airlineId} not found`);
    }

    const airport = airline.airports.find((a) => a.id === airportId);
    if (!airport) {
      throw new NotFoundException(`Airport with ID ${airportId} not found for this airline`);
    }

    return airport;
  }

  async deleteAirportFromAirline(
    airlineId: string,
    airportId: string
  ): Promise<AirlineEntity> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ["airports"],
    });
    if (!airline) {
      throw new NotFoundException(`Airline with ID ${airlineId} not found`);
    }

    airline.airports = airline.airports.filter(
      (airport) => airport.id !== airportId
    );
    return this.airlineRepository.save(airline);
  }

  async updateAirportsFromAirline(
    airlineId: string,
    airportIds: string[]
  ): Promise<AirlineEntity> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ["airports"],
    });
    if (!airline) {
      throw new NotFoundException(`Airline with ID ${airlineId} not found`);
    }

    const airports = await this.airportRepository.findByIds(airportIds);
    if (airports.length !== airportIds.length) {
      throw new BadRequestException('One or more airports not found');
    }

    airline.airports = airports;
    return this.airlineRepository.save(airline);
  }
}
