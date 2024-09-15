import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { AirportService } from "./airport.service";
import { CreateAirportDto, UpdateAirportDto } from "./airport.dto";

@Controller("airports")
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  findAll() {
    return this.airportService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.airportService.findOne(id);
  }

  @Post()
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportService.create(createAirportDto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportService.update(id, updateAirportDto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.airportService.delete(id);
  }
}
