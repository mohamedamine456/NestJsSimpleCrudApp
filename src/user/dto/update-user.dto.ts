import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    FirstName?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    LastName?: string;

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    Email?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    password?: string;
}