import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AirportEntity } from "./airport.entity";
import { CreateAirportDto, UpdateAirportDto } from "./airport.dto";

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>
  ) {}

  findAll(): Promise<AirportEntity[]> {
    return this.airportRepository.find();
  }

  async findOne(id: string): Promise<AirportEntity> {
    const airport = await this.airportRepository.findOne({ where: { id } });
    if (!airport) {
      throw new NotFoundException(`Airport with ID ${id} not found`);
    }
    return airport;
  }

  create(createAirportDto: CreateAirportDto): Promise<AirportEntity> {
    if (createAirportDto.code.length !== 3) {
      throw new BadRequestException('Airport code must be exactly 3 characters long');
    }
    const airport = this.airportRepository.create(createAirportDto);
    return this.airportRepository.save(airport);
  }

  async update(
    id: string,
    updateAirportDto: UpdateAirportDto
  ): Promise<AirportEntity> {
    if (updateAirportDto.code.length !== 3) {
      throw new BadRequestException('Airport code must be exactly 3 characters long');
    }
    await this.airportRepository.update(id, updateAirportDto);
    const updatedAirport = await this.airportRepository.findOne({
      where: { id },
    });
    if (!updatedAirport) {
      throw new NotFoundException(`Airport with ID ${id} not found`);
    }
    return updatedAirport;
  }

  async delete(id: string): Promise<void> {
    const result = await this.airportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Airport with ID ${id} not found`);
    }
  }
}
