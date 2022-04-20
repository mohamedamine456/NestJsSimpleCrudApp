import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable({})
export class UserService {
    constructor( private prisma: PrismaService ) {}

    // Function to get all users
    async getAll() {
        const users = await this.prisma.user.findMany();

        // delete password for each user
        users.map(user => { delete user.passwordHash });

        return users;
    }

    // function to user based on his id
    async getUserById( userId: number ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        // delete password for user
        delete user.passwordHash;
        return user;
    }

    // function to create new user
    async createUser( dto: CreateUserDto ) {
        const passwordHash =  await argon.hash(dto.password);
        delete dto.password;
        const user = await this.prisma.user.create({
            data: {
                ...dto,
                passwordHash
            }
        });

        // delete password for user
        delete user.passwordHash;
        return user;
    }

    // function to update already existing user
    async updateUserById( dto: UpdateUserDto, userId: number ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw new ForbiddenException('User Not Found');
        }
        const passwordHash = dto.password &&  await argon.hash(dto.password);
        delete dto.password;
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                passwordHash,
                ...dto
            }
        });

        // delete password for user
        delete updatedUser.passwordHash;
        return updatedUser;
    }

    // function te remove a user if existed
    async deleteUserById( userId: number ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw new ForbiddenException('User Not Found');
        }

        const deletedUser = await this.prisma.user.delete({
            where: {
                id: userId
            }
        });

        return { message: "User Deleted Successfully" };
    }
}
