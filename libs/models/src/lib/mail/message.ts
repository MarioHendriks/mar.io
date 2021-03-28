import { IsNotEmpty } from "class-validator"

export class message {
    @IsNotEmpty()
    firstname: string
    
    @IsNotEmpty()
    lastname: string

    @IsNotEmpty()
    email: string
}