import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Admin } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../../prisma/prisma.service';
import { PolicyCreateDTO } from '../dtos/policy.create.dto';
import { PolicyDTO } from '../dtos/policy.dto';
import { PolicyUpdateDTO } from '../dtos/policy.update.dto';

@Injectable()
export class PolicyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * @name findById
   * @description Get a policy by ID
   * @param {string} id
   * @returns {Promise<PolicyDTO>}
   */
  async findById(id: string): Promise<PolicyDTO> {
    const policy = await this.prisma.policy.findFirst({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        admin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!policy)
      throw new NotFoundException(`policy with ID or title ${id} not found`);

    return plainToInstance(PolicyDTO, policy);
  }

  /**
   * @name findByTitle
   * @description Get a policy by title (이용약관/개인정보처리 방침 등)
   * @param {string} title
   * @returns {Promise<PolicyDTO | null>}
   */
  async findByTitle(title: string): Promise<PolicyDTO | null> {
    const policy = await this.prisma.policy.findFirst({
      where: {
        title,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        admin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!policy) return null;
    return plainToInstance(PolicyDTO, policy);
  }

  /**
   * @name create
   * @description Create a new policy
   * @param {CreatePolicyDTO} data
   * @param {Admin} user
   * @returns {Promise<boolean>}
   */
  async create(data: PolicyCreateDTO, user: Admin): Promise<boolean> {
    await this.prisma.policy.create({
      data: {
        title: data.title,
        content: data.content,
        admin: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return true;
  }

  /**
   * @name update
   * @description Update an existing policy
   * @param {string} id
   * @param {UpdatePolicyDTO} data
   * @param {Admin} user
   * @returns {Promise<boolean>}
   */
  async update(
    id: string,
    data: PolicyUpdateDTO,
    user: Admin,
  ): Promise<boolean> {
    let exists = await this.prisma.policy.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        admin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // id로 못 찾으면 title로도 시도 (terms, privacy)
    if (!exists && (id === 'terms' || id === 'privacy')) {
      const title = id === 'terms' ? '이용약관' : '개인정보처리 방침';
      exists = await this.prisma.policy.findFirst({
        where: { title, deletedAt: null },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          admin: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!exists) throw new NotFoundException(`policy with ID ${id} not found`);

    await this.prisma.policy.update({
      where: { id: exists.id },
      data,
    });

    return true;
  }

  /**
   * @name delete
   * @description Delete a policy
   * @param {string} id
   * @param {Admin} user
   * @returns {Promise<boolean>}
   */
  async delete(id: string, user: Admin): Promise<boolean> {
    const exists = await this.prisma.policy.findUnique({
      where: { id },
      select: { id: true, title: true },
    });

    if (!exists) throw new NotFoundException(`policy with ID ${id} not found`);

    await this.prisma.policy.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }
}
