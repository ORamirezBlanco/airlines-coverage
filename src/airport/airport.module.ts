import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AirportService } from "./airport.service";
import { AirportController } from "./airport.controller";
import { AirportEntity } from "./airport.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  controllers: [AirportController],
  providers: [AirportService],
})
export class AirportModule {}
