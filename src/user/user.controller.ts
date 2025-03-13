import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from './entities/user.entity';
import { Role } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'CREATE USER',
    description:
      'Private endpoint to create a new user. Only users with the "admin" role can create users, including other "admin" users.',
  })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Auth(Role.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'GET ALL USERS',
    description:
      'Private endpoint to list all users. Only users with the "admin" role can access this endpoint.',
  })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Auth(Role.admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'GET USER BY ID',
    description:
      'Private endpoint to get user data by ID. Users with the "user" role can only access their own information. Admins can access any user\'s information.',
  })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Auth(Role.admin, Role.user)
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.userService.findOne('id', id, user);
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'GET USER BY EMAIL',
    description:
      'Private endpoint to get user data by email. Users with the "user" role can only access their own information. Admins can access any user\'s information.',
  })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Auth(Role.admin, Role.user)
  findOneByEmail(@Param('email') email: string, @GetUser() user: User) {
    return this.userService.findOne('email', email, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'UPDATE USER BY ID',
    description:
      'Private endpoint to update user data by ID. Users with the "user" role can only update their own information. Admins can update any user\'s information. Only admins can update the "role" field.',
  })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Auth(Role.admin, Role.user)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.update('id', id, updateUserDto, user);
  }

  @Patch('email/:email')
  @ApiOperation({
    summary: 'UPDATE USER BY EMAIL',
    description:
      'Private endpoint to update user data by email. Users with the "user" role can only update their own information. Admins can update any user\'s information. Only admins can update the "role" field.',
  })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Auth(Role.admin, Role.user)
  updateByEmail(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.update('email', email, updateUserDto, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'DELETE USER BY ID',
    description:
      'Private endpoint to delete a user by ID. Users with the "user" role can only delete their own account. Admins can delete any user.',
  })
  @ApiOkResponse({
    content: {
      'application/json': { example: { message: 'User deleted successfully' } },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Auth(Role.admin, Role.user)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.userService.remove('id', id, user);
  }

  @Delete('email/:email')
  @ApiOperation({
    summary: 'DELETE USER BY EMAIL',
    description:
      'Private endpoint to delete a user by email. Users with the "user" role can only delete their own account. Admins can delete any user.',
  })
  @ApiOkResponse({
    content: {
      'application/json': { example: { message: 'User deleted successfully' } },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Auth(Role.admin, Role.user)
  removeByEmail(@Param('email') email: string, @GetUser() user: User) {
    return this.userService.remove('email', email, user);
  }
}