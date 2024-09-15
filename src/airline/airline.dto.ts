export class CreateAirlineDto {
    readonly name: string;
    readonly description: string;
    readonly foundationDate: Date;
    readonly website: string;
}

export class UpdateAirlineDto {
    readonly name?: string;
    readonly description?: string;
    readonly foundationDate?: Date;
    readonly website?: string;
}
