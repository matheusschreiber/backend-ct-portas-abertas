import { IsEmail, IsNotEmpty, IsNumber, Length } from "class-validator"

export class CreateSchoolDto {

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    nameRes: string

    @IsNotEmpty()
    @Length(11,11,{message:"cpf inválido"})
    cpfRes: string

    @IsNotEmpty()
    @IsNumber()
    studentsAmount: number

    @IsNotEmpty()
    @Length(8,255,{message:"senha inválida"})
    password: string

    @IsNotEmpty()
    @IsEmail({},{message:"email inválido"})
    emailRes: string
}
