import { IsEmail, IsNotEmpty, IsString, Length, maxLength, MaxLength, MinLength } from "class-validator"

export class CreateStudentDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @Length(11,11,{message:"cpf inválido"})
    cpf: string

    @IsNotEmpty()
    @Length(8,255,{message:"senha inválida"})
    password: string

    @IsNotEmpty()
    @IsEmail({}, {message:"email inválido"})
    email: string
}
