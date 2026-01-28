// import {
//   Injectable,
//   NestMiddleware,
//   ForbiddenException,
//   HttpException,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { PrismaService } from '../prisma/prisma.service';
// import * as jwt from 'jsonwebtoken';
// import { AuthUtil } from '../app/auth/auth.util';

// @Injectable()
// export class PermissionMiddleware implements NestMiddleware {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly authUtil: AuthUtil,
//   ) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     try {
//       const method = req.method;
//       const array = req.baseUrl
//         .split('/')
//         .filter((item) => item !== '' && item !== 'api' && item !== 'v1');

//       // permission이 설정되어있는 메뉴 가져오기
//       const menus = await this.prisma.menu.findMany({
//         where: {
//           apiUrl: {
//             in: array,
//           },
//           permissions: {
//             some: {},
//           },
//         },
//         include: {
//           permissions: true,
//         },
//       });

//       // 권한이 설정되어있지 않다면 next 함수 실행
//       if (!menus.length) {
//         next();
//         return;
//       }

//       // 헤더에서 JWT 토큰 추출
//       const token = req.headers.authorization?.split(' ')[1];
//       if (!token) throw new HttpException('접근 권한이 없습니다', 497);

//       const payload = this.authUtil.verifyToken(token);
//       if (!payload) throw new HttpException('접근 권한이 없습니다', 497);

//       // 사용자 정보 가져오기
//       const user = await this.prisma.user.findUnique({
//         where: { id: payload['id'] },
//         include: { permission: true },
//       });

//       if (!user) throw new HttpException('접근 권한이 없습니다.', 497);

//       // 사용자 정보 저장
//       req['user'] = user;

//       // 최고 관리자 권한일 경우 skip
//       if (user.permission.super) {
//         next();
//         return;
//       }

//       for (const menu of menus) {
//         for (const permission of menu.permissions) {
//           if (
//             permission.level <= user.permission.level &&
//             permission.roleId === user.permission.roleId
//           ) {
//             switch (method) {
//               case 'GET':
//                 if (permission.canRead) {
//                   req['user'] = user;
//                   next();
//                   return;
//                 }
//                 break;
//               case 'POST':
//                 if (permission.canCreate) {
//                   req['user'] = user;
//                   next();
//                   return;
//                 }
//                 break;
//               case 'PUT':
//                 if (permission.canUpdate) {
//                   req['user'] = user;
//                   next();
//                   return;
//                 }
//                 break;
//               case 'DELETE':
//                 if (permission.canDelete) {
//                   req['user'] = user;
//                   next();
//                   return;
//                 }
//                 break;
//               default:
//                 throw new HttpException('접근 권한이 없습니다.', 497);
//             }
//           }
//         }
//       }

//       throw new HttpException('접근 권한이 없습니다.', 497);
//     } catch (error) {
//       throw new HttpException('접근 권한이 없습니다.', 497);
//     }
//   }
// }
