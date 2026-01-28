import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import * as ip from "ip";
import * as requestIp from "request-ip";
import { PrismaService } from "../prisma/prisma.service";

dotenv.config();

@Injectable()
export class IpFilterMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ipAddress = requestIp.getClientIp(req);
    if (!ipAddress)
      throw new BadRequestException("IP 정보를 찾을 수 없습니다.");

    const blockedIps = await this.prismaService.ip.findMany({
      where: {
        isBlocked: true,
      },
      select: {
        ip: true,
      },
    });

    for (const blockedIp of blockedIps) {
      if (blockedIp.ip && blockedIp === ipAddress)
        throw new BadRequestException("차단된 IP입니다.");

      if (blockedIp.ip && ip.cidrSubnet(blockedIp.ip).contains(ipAddress))
        throw new BadRequestException("차단된 IP입니다.");
    }

    next();
  }
}
