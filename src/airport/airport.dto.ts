export class CreateAirportDto {
    readonly name: string;
    readonly code: string;
    readonly country: string;
    readonly city: string;
}

export class UpdateAirportDto {
    readonly name?: string;
    readonly code?: string;
    readonly country?: string;
    readonly city?: string;
}
