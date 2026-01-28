import { EventEmitter2 } from "@nestjs/event-emitter";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaModule } from "../../../prisma/prisma.module";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserService } from "../user.service";
import { UserBuilder } from "./user.builder";

describe("UserService", () => {
  let service: UserService;
  let prisma: PrismaService;
  let builder: UserBuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserService, UserBuilder, EventEmitter2],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    builder = module.get<UserBuilder>(UserBuilder);
  });

  describe("findById", () => {
    it("should return a user", async () => {
      const mockUser = builder.createRandomUser();

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);

      const user = await service.findById(mockUser.id);
      expect(user).toBeDefined(); // null / undefeind 가 아니다!
      expect(user).toEqual(mockUser);
    });

    it("if there is no user, should throw NotFoundException", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow(
        "사용자를 찾을 수 없습니다.",
      );
    });
  });

  describe("findByEmail", () => {
    it("should return a user", async () => {
      const mockUser = builder.createRandomUser();

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);

      const user = await service.findByEmail(mockUser.email);
      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe("findByContact", () => {
    it("should return a user", async () => {
      const mockUser = builder.createRandomUser();

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);

      const user = await service.findByContact(mockUser.contact);
      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe("create", () => {
    it("should create a user", async () => {
      const mockUser = builder.createRandomUser();

      jest.spyOn(prisma.user, "create").mockResolvedValue(mockUser);

      const user = await service.create(mockUser);
      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const mockUser = builder.createRandomUser();

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, "update").mockResolvedValue(mockUser);

      const user = await service.update(mockUser.id, mockUser);
      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });

    it("if there is no user, should throw NotFoundException", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      await expect(
        service.update("1", builder.createRandomUser()),
      ).rejects.toThrow("사용자를 찾을 수 없습니다.");
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const mockUser = builder.createRandomDeletedUser();

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, "delete").mockResolvedValue(mockUser);

      const user = await service.delete(mockUser.id);
      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });

    it("if there is no user, should throw NotFoundException", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(
        "사용자를 찾을 수 없습니다.",
      );
    });
  });
});
