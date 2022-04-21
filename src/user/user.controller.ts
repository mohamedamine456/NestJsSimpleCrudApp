import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor( private userService: UserService ) {}

    @Get('all')
    getAll() {
        return this.userService.getAll();
    }

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.getUserById(userId);
    }

    @Post()
    createUser(
        @Body() dto: CreateUserDto
    ) {
        return this.userService.createUser(dto);
    }

    @Patch(':id')
    updateUserById(
        @Body() dto: UpdateUserDto,
        @Param('id', ParseIntPipe) userId: number
    ) {
        return this.userService.updateUserById(dto, userId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.deleteUserById(userId);
    }
}
