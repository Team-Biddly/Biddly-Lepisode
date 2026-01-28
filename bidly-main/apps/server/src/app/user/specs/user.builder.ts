import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class UserBuilder {
  private user: Partial<User>;

  constructor() {
    this.user = {};
  }

  setId(id: string): UserBuilder {
    this.user.id = id;
    return this;
  }

  setName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  setNickname(nickname: string): UserBuilder {
    this.user.nickname = nickname;
    return this;
  }

  setCreatedAt(createdAt: Date): UserBuilder {
    this.user.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date): UserBuilder {
    this.user.updatedAt = updatedAt;
    return this;
  }

  setContact(contact: string): UserBuilder {
    this.user.contact = contact;
    return this;
  }

  build(): Partial<User> {
    return this.user;
  }

  public createRandomUser(): User {
    return new UserBuilder()
      .setId(faker.string.uuid())
      .setName(faker.person.firstName())
      .setNickname(faker.person.fullName())
      .setContact(faker.phone.number())
      .setCreatedAt(faker.date.past())
      .setUpdatedAt(faker.date.recent())
      .build() as User;
  }

  public createRandomBlockedUser(): User {
    return new UserBuilder()
      .setId(faker.string.uuid())
      .setName(faker.person.firstName())
      .setNickname(faker.person.fullName())
      .setContact(faker.phone.number())
      .setCreatedAt(faker.date.past())
      .setUpdatedAt(faker.date.recent())
      .build() as User;
  }

  public createRandomDeletedUser(): User {
    return new UserBuilder()
      .setId(faker.string.uuid())
      .setName(faker.person.firstName())
      .setNickname(faker.person.fullName())
      .setContact(faker.phone.number())
      .setCreatedAt(faker.date.past())
      .setUpdatedAt(faker.date.recent())
      .build() as User;
  }

  public createWithdrawnUser(): User {
    return new UserBuilder()
      .setId(faker.string.uuid())
      .setName(faker.person.firstName())
      .setNickname(faker.person.fullName())
      .setContact(faker.phone.number())
      .setCreatedAt(faker.date.past())
      .setUpdatedAt(faker.date.recent())
      .build() as User;
  }
}
