import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { BaseEntity } from '../shared/entities/base.entity';

@Entity('airline')
export class AirlineEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    foundationDate: Date;

    @Column()
    website: string;

    @ManyToMany(() => AirportEntity, (airport) => airport.airlines, { cascade: true })
    @JoinTable()
    airports: AirportEntity[];
}