import { Controller, Post, Get, Delete, Param, Put, Body } from "@nestjs/common";
import { AirlineAirportService } from "./airline-airport.service";

@Controller("airlines")
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(":airlineId/airports/:airportId")
  addAirportToAirline(
    @Param("airlineId") airlineId: string,
    @Param("airportId") airportId: string
  ) {
    return this.airlineAirportService.addAirportToAirline(airlineId, airportId);
  }

  @Get(":airlineId/airports")
  findAirportsFromAirline(@Param("airlineId") airlineId: string) {
    return this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Get(":airlineId/airports/:airportId")
  findAirportFromAirline(
    @Param("airlineId") airlineId: string,
    @Param("airportId") airportId: string
  ) {
    return this.airlineAirportService.findAirportFromAirline(airlineId, airportId);
  }

  @Put(":airlineId/airports")
  updateAirportsFromAirline(
    @Param("airlineId") airlineId: string,
    @Body() airportIds: string[]
  ) {
    return this.airlineAirportService.updateAirportsFromAirline(airlineId, airportIds);
  }

  @Delete(":airlineId/airports/:airportId")
  deleteAirportFromAirline(
    @Param("airlineId") airlineId: string,
    @Param("airportId") airportId: string
  ) {
    return this.airlineAirportService.deleteAirportFromAirline(
      airlineId,
      airportId
    );
  }
}
