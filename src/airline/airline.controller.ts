import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { AirlineService } from "./airline.service";
import { CreateAirlineDto, UpdateAirlineDto } from "./airline.dto";

@Controller("airlines")
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Get()
  findAll() {
    return this.airlineService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.airlineService.findOne(id);
  }

  @Post()
  create(@Body() createAirlineDto: CreateAirlineDto) {
    return this.airlineService.create(createAirlineDto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateAirlineDto: UpdateAirlineDto) {
    return this.airlineService.update(id, updateAirlineDto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.airlineService.delete(id);
  }
}
