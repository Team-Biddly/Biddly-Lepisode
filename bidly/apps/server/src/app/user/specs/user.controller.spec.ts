import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../../prisma/prisma.module';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserBuilder } from './user.builder';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthModule } from '../../auth/auth.module';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let builder: UserBuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, AuthModule],
      controllers: [UserController],
      providers: [UserService, UserBuilder, EventEmitter2],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    builder = module.get<UserBuilder>(UserBuilder);
  });

  describe('findById', () => {
    it('should return a user', async () => {
      const mockUser = builder.createRandomUser();

      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);

      const user = await controller.findById(mockUser.id);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const mockUser = builder.createRandomUser();

      jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      const user = await controller.create(mockUser);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const mockUser = builder.createRandomUser();

      jest.spyOn(service, 'update').mockResolvedValue(mockUser);

      const user = await controller.update(mockUser.id, mockUser);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const mockUser = builder.createRandomUser();

      jest.spyOn(service, 'delete').mockResolvedValue(mockUser);

      const user = await controller.delete(mockUser.id);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });
  });
});
