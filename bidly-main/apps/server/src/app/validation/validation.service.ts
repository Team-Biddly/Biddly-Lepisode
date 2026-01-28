import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @name checkDuplicateContact
   * @param {string} contact
   * @returns {Promise<boolean>}
   */
  async checkDuplicateContact(contact: string): Promise<boolean> {
    if (!contact) throw new Error('Contact is required');
    return (
      0 <
      (await this.prisma.user.count({
        where: {
          contact,
        },
      }))
    );
  }
}
