import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from 'src/user/dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      }),
    );

    app.init();
    app.listen(3333);

    // clean DB
    prisma = app.get(PrismaService);
    await prisma.cleandDb();

    // set base url for pactum
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });


  // Tests For User
  describe('User', () => {
    // Get All Users (The DB is Empty)
    describe('Get All Users (Empty Array)', () => {
      it('should get all users', () => {
        return pactum
        .spec()
        .get('/users/all')
        .expectStatus(200)
        .expectBody([])
        .expectJsonLength(0)
      });
    });

    // Create New User
    describe('Create New User', () => {
      // Declare a User
      let dto: CreateUserDto = {
        FirstName: 'Amine',
        LastName: 'Mohamed',
        Email: 'aminelachheb@gmail.com',
        password: 'randomPassword'
      };

      // Create New User
      it('create New User', () => {
        return pactum
        .spec()
        .post('/users/')
        .withBody(dto)
        .expectStatus(201)
        .stores('userId', 'id')
      });

      // Add User to Delete
      it('create New User', () => {
        return pactum
        .spec()
        .post('/users/')
        .withBody({
          FirstName: 'Random Person',
          LastName: 'Anoun',
          Email: 'random@test.com',
          password: 'randomPassword'
        })
        .expectStatus(201)
        .stores('userIdToDelete', 'id')
      });
    });
    describe('Edit User', () => {
      // Modify a User
      let dto: UpdateUserDto = {
        FirstName: 'Mohamed Amine',
        LastName: 'Lachheb',
        Email: 'aminelachheb4@gmail.com',
        password: 'Str@ngPassword45'
      };

      // Edit New User
      it('Edit User', () => {
        return pactum
        .spec()
        .patch('/users/{id}')
        .withPathParams('id', '$S{userId}')
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains('$S{userId}')
      });
    });

    describe('Get All Users (Array[2])', () => {
      // Get All Users
      describe('Get All Users', () => {
        it('should get all users', () => {
          return pactum
          .spec()
          .get('/users/all')
          .expectStatus(200)
          .expectJsonLength(2)
        });
      });
    });

    describe('Delete User', () => {
      // Delete User
      it('Delete User', () => {
        return pactum
        .spec()
        .delete('/users/{id}')
        .withPathParams('id', '$S{userIdToDelete}')
        .expectStatus(204)
      });
    });

    describe('Get User By Id', () => {
      // Get User By Id
      it('should get user By Id', () => {
        return pactum
        .spec()
        .get('/users/{id}')
        .withPathParams('id', '$S{userId}')
        .expectStatus(200)
      });
    });
  });
});
