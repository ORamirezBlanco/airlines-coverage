import { Controller, Post, Get, Delete, Param, Put, Body } from "@nestjs/common";
import { AirlineAirportService } from "./airline-airport.service";

@Controller("airlines")
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  // Agrega un aeropuerto a una aerolínea
  @Post(":airlineId/airports/:airportId")
  addAirportToAirline(
    @Param("airlineId") airlineId: string,
    @Param("airportId") airportId: string
  ) {
    return this.airlineAirportService.addAirportToAirline(airlineId, airportId);
  }

  // Encuentra todos los aeropuertos asociados a una aerolínea
  @Get(":airlineId/airports")
  findAirportsFromAirline(@Param("airlineId") airlineId: string) {
    return this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  // Encuentra un aeropuerto específico asociado a una aerolínea
  @Get(":airlineId/airports/:airportId")
  findAirportFromAirline(
    @Param("airlineId") airlineId: string,
    @Param("airportId") airportId: string
  ) {
    return this.airlineAirportService.findAirportFromAirline(airlineId, airportId);
  }

  // Actualiza la lista de aeropuertos asociados a una aerolínea
  @Put(":airlineId/airports")
  updateAirportsFromAirline(
    @Param("airlineId") airlineId: string,
    @Body() airportIds: string[]
  ) {
    return this.airlineAirportService.updateAirportsFromAirline(airlineId, airportIds);
  }

  // Elimina un aeropuerto de una aerolínea
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
