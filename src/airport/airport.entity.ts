import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { BaseEntity } from '../shared/entities/base.entity';

@Entity('airport')
export class AirportEntity extends BaseEntity {

  @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @ManyToMany(() => AirlineEntity, (airline) => airline.airports)
    airlines: AirlineEntity[];
}