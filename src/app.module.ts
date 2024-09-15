import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';

@Module({
  imports: [
    AirlineModule,
    AirportModule,
    AirlineAirportModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.db', 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
      keepConnectionAlive: true, 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
