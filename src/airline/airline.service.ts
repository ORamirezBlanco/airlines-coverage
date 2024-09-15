import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AirlineEntity } from "./airline.entity";
import { CreateAirlineDto, UpdateAirlineDto } from "./airline.dto";

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>
  ) {}

  findAll(): Promise<AirlineEntity[]> {
    return this.airlineRepository.find();
  }

  async findOne(id: string): Promise<AirlineEntity> {
    const airline = await this.airlineRepository.findOne({ where: { id } });
    if (!airline) {
      throw new NotFoundException(`Airline with ID ${id} not found`);
    }
    return airline;
  }

  create(createAirlineDto: CreateAirlineDto): Promise<AirlineEntity> {
    const currentDate = new Date();
    if (new Date(createAirlineDto.foundationDate) >= currentDate) {
      throw new BadRequestException('Founding date must be in the past');
    }
    const airline = this.airlineRepository.create(createAirlineDto);
    return this.airlineRepository.save(airline);
  }

  async update(
    id: string,
    updateAirlineDto: UpdateAirlineDto
  ): Promise<AirlineEntity> {
    const currentDate = new Date();
    if (new Date(updateAirlineDto.foundationDate) >= currentDate) {
      throw new BadRequestException('Founding date must be in the past');
    }
    await this.airlineRepository.update(id, updateAirlineDto);
    const updatedAirline = await this.airlineRepository.findOne({
      where: { id },
    });
    if (!updatedAirline) {
      throw new NotFoundException(`Airline with ID ${id} not found`);
    }
    return updatedAirline;
  }

  async delete(id: string): Promise<void> {
    const result = await this.airlineRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Airline with ID ${id} not found`);
    }
  }
}
