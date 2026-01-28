import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBusinessInfoDTO } from './dtos/create-business-info.dto';
import { UpdateBusinessInfoDTO } from './dtos/update-business-info.dto';

@Injectable()
export class BusinessInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async getBusinessInfo() {
    return this.prisma.businessInfo.findFirst({
      include: { logo: true, admin: { select: { id: true, name: true } } },
    });
  }

  async create(data: CreateBusinessInfoDTO, adminId: string): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      if (!data.logo?.url) {
        throw new BadRequestException('logo.url is required');
      }

      let file = await tx.file.findUnique({ where: { url: data.logo.url } });

      if (!file) {
        file = await tx.file.create({
          data: {
            url: data.logo.url,
            mimeType: data.logo.mimeType ?? 'image/webp',
            name: data.logo.name ?? null,
            size: data.logo.size ?? 0,
            createdAt: data.logo.createdAt
              ? new Date(data.logo.createdAt)
              : new Date(),
          },
        });
      }

      const { logo, createdAt, updatedAt, ...rest } = data as any;

      await tx.businessInfo.create({
        data: {
          ...rest,
          admin: { connect: { id: adminId } },
          logo: { connect: { id: file.id } },
        },
      });

      return true;
    });
  }

  async update(data: UpdateBusinessInfoDTO): Promise<boolean> {
    const businessInfo = await this.prisma.businessInfo.findFirst();
    if (!businessInfo) throw new NotFoundException('BusinessInfo not found');

    if (!data.logo?.url) {
      throw new BadRequestException('logo.url is required');
    }

    let file = await this.prisma.file.findUnique({
      where: { url: data.logo.url },
    });
    if (!file) {
      file = await this.prisma.file.create({
        data: {
          url: data.logo.url,
          mimeType: data.logo.mimeType ?? 'image/webp',
          name: data.logo.name ?? null,
          size: data.logo.size ?? 0,
          createdAt: data.logo.createdAt
            ? new Date(data.logo.createdAt)
            : new Date(),
        },
      });
    }

    const { logo, createdAt, updatedAt, ...rest } = data as any;

    await this.prisma.businessInfo.update({
      where: { id: businessInfo.id },
      data: {
        ...rest,
        logo: { connect: { id: file.id } },
      },
    });

    return true;
  }
}
