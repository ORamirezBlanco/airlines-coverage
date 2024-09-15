import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AirlineService } from "./airline.service";
import { AirlineController } from "./airline.controller";
import { AirlineEntity } from "./airline.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  controllers: [AirlineController],
  providers: [AirlineService],
})
export class AirlineModule {}
