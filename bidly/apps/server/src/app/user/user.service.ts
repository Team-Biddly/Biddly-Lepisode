import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdatePasswordDTO, UpdateUserDTO } from './dtos/update-user.dto';

import { AccessTokenPayload, RefreshTokenPayload, UserRole } from '@common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthProvider, Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { randomInt } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { TokenDTO } from '../../libs';
import { DateUtil, PeriodString } from '../../libs/util/date.util';
import { AuthUtil } from '../auth/auth.util';
import { EmailService } from '../email/email.service';
import { OauthCreateDTO } from '../oauth/dtos/oauth.create.dto';
import { SettingService } from '../setting/setting.service';
import { ResetPasswordTokenDTO } from '../validation/dtos/reset.password.token.dto';
import { ContactValidationDTO } from './dtos/contact-validation.dto';
import { EmailValidationDTO } from './dtos/email-validation.dto';
import { SearchUserDTO } from './dtos/search-user.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { UserDTO } from './dtos/user.dto';
import { WithdrawUserDTO } from './dtos/withdraw-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly setting: SettingService,
    private readonly prisma: PrismaService,
    private readonly dateUtil: DateUtil,
    private readonly authUtil: AuthUtil,
    private readonly eventEmitter: EventEmitter2,
    private readonly emailService: EmailService,
    // private readonly validation: ValidationService,
  ) {}

  /**
   *  @name getMe
   *  @description get current user information
   *  @param {string} id
   *  @returns {Promise<UserDTO>}
   */
  async getMe(id: string): Promise<UserDTO> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        nickname: true,
        contact: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
        auths: {
          select: {
            id: true,
            email: true,
            provider: true,
          },
          orderBy: {
            createdAt: Prisma.SortOrder.desc,
          },
        },
        blockLogs: {
          select: {
            id: true,
            createdAt: true,
            until: true,
            userId: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    return plainToInstance(UserDTO, user);
  }

  /**
   * 회원을 ID 기반으로 조회합니다.
   * @returns {Promise<User[]>} 사용자 정보
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        permission: {
          include: {
            role: true,
          },
        },
        auths: {
          omit: {
            password: true,
          },
        },
        blockLogs: true,
        withdrawnLogs: true,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * @name getAccessTokenByContact
   * @description get user by contact and return access token
   * @param {string} contact
   * @returns {Promise<TokenDTO>}
   */
  async getAccessTokenByContact(contact: string): Promise<TokenDTO> {
    const phoneRegex = /^\d{3}\d{3,4}\d{4}$/;

    if (!phoneRegex.test(contact))
      throw new BadRequestException('연락처 형식이 아닙니다.');

    const user = await this.prisma.user.findUnique({ where: { contact } });

    if (!user) return { accessToken: '', refreshToken: '' };

    const accessToken = this.authUtil.createToken<AccessTokenPayload>(
      {
        id: user.id,
        role: UserRole.USER,
      },
      process.env.USER_REFRESH_TOKEN_EXPIRES_IN!,
    );

    return {
      accessToken,
      refreshToken: user.refreshToken || '',
    };
  }

  /**
   * @name getAccessTokenByEmail
   * @description get user by email and return access token
   * @param {string} email
   * @returns {Promise<TokenDTO>}
   */
  async getAccessTokenByEmail(email: string): Promise<TokenDTO> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return { accessToken: '', refreshToken: '' };

    const accessToken = this.authUtil.createToken<AccessTokenPayload>(
      {
        id: user.id,
        role: UserRole.USER,
      },
      process.env.USER_REFRESH_TOKEN_EXPIRES_IN!,
    );

    return {
      accessToken,
      refreshToken: user.refreshToken || '',
    };
  }

  /**
   * @name signUpWithSNS
   * @description sign up with social network service
   * @param {CreateUserDTO} data
   * @param {string} token
   * @returns {Promise<UserDTO>}
   */
  // async signUpWithSNS(data: CreateUserDTO, token: string): Promise<UserDTO> {
  //   const payload = this.authUtil.verifyToken<CreateUserDTO>(token);
  //   if (!payload) throw new BadRequestException('유효하지 않은 토큰입니다.');
  //   const { oAuth } = data;
  //   if (!oAuth) throw new BadRequestException('소셜 계정 정보가 필요합니다.');

  //   return await this.prisma.$transaction(async (tx) => {
  //     const existingUser = await tx.user.findUnique({
  //       // where: { contact: data.contact },
  //       where: { email: oAuth.email },
  //       include: { auths: true },
  //     });

  //     console.log('=======>existingUser: ', existingUser);

  //     let user;

  //     if (existingUser) {
  //       // SNS 계정 중복 확인
  //       const authExists = existingUser.auths.some(
  //         (a) => a.provider === oAuth.provider && a.email === oAuth.email,
  //       );
  //       if (authExists) {
  //         throw new BadRequestException('이미 연결된 SNS 계정입니다.');
  //       }

  //       user = existingUser;
  //     } else {
  //       // 새 유저 생성
  //       user = await tx.user.create({
  //         data: {
  //           name: data.name,
  //           contact: data.contact,
  //           email: oAuth.email,
  //           permissionId: data.permissionId,
  //         },
  //       });

  //       console.log('=======>new user created: ', user);
  //       console.log('=======>oAuth: ', oAuth);
  //       console.log('=======>data: ', data);
  //     }

  //     // SNS auth 추가
  //     await tx.auth.create({
  //       data: {
  //         providerId: oAuth.providerId,
  //         provider: oAuth.provider,
  //         email: oAuth.email,
  //         user: { connect: { id: user.id } },
  //       },
  //     });

  //     // 토큰 생성
  //     const accessToken = this.authUtil.createToken<AccessTokenPayload>(
  //       { id: user.id, role: UserRole.USER },
  //       process.env.USER_ACCESS_TOKEN_EXPIRES_IN!,
  //     );

  //     const refreshToken = this.authUtil.createToken<RefreshTokenPayload>(
  //       { id: user.id, role: UserRole.USER, isRefreshToken: true },
  //       process.env.USER_REFRESH_TOKEN_EXPIRES_IN!,
  //     );

  //     await tx.user.update({
  //       where: { id: user.id },
  //       data: { refreshToken },
  //     });

  //     return plainToInstance(UserDTO, { ...user, accessToken });
  //   });
  // }
  async signUpWithSNS(data: CreateUserDTO, token: string): Promise<UserDTO> {
    const payload = this.authUtil.verifyToken<CreateUserDTO>(token);
    if (!payload) throw new BadRequestException('유효하지 않은 토큰입니다.');

    const { oAuth } = data;
    if (!oAuth || !oAuth.email)
      throw new BadRequestException('소셜 계정 이메일이 필요합니다.');

    return await this.prisma.$transaction(async (tx) => {
      // 기존 유저 조회 (항상 oAuth.email 기준)
      let user = await tx.user.findUnique({
        where: { email: oAuth.email },
        include: { auths: true },
      });

      if (user) {
        // 같은 SNS 계정 이미 연결 여부 확인
        const authExists = user.auths.some(
          (a) => a.provider === oAuth.provider && a.email === oAuth.email,
        );
        if (authExists) {
          throw new BadRequestException('이미 연결된 SNS 계정입니다.');
        }
      } else {
        // 새 유저 생성 (auths 포함해서 생성)
        user = await tx.user.create({
          data: {
            name: data.name,
            contact: data.contact,
            email: oAuth.email,
            permissionId: data.permissionId,
            auths: {
              create: {
                provider: oAuth.provider,
                providerId: oAuth.providerId,
                email: oAuth.email,
                password: null, // 소셜 로그인이라 비밀번호 없음
              },
            },
          },
          include: { auths: true }, // auths 포함해서 반환
        });
      }

      // 기존 유저라면 새 SNS auth 추가
      if (
        user &&
        !user.auths.some(
          (a) => a.provider === oAuth.provider && a.email === oAuth.email,
        )
      ) {
        const newAuth = await tx.auth.create({
          data: {
            provider: oAuth.provider,
            providerId: oAuth.providerId,
            email: oAuth.email,
            user: { connect: { id: user.id } },
          },
        });
        // 새로 추가한 auth를 user.auths에 포함
        user.auths.push(newAuth);
      }

      // 토큰 생성
      const accessToken = this.authUtil.createToken<AccessTokenPayload>(
        { id: user.id, role: UserRole.USER },
        process.env.USER_ACCESS_TOKEN_EXPIRES_IN!,
      );

      const refreshToken = this.authUtil.createToken<RefreshTokenPayload>(
        { id: user.id, role: UserRole.USER, isRefreshToken: true },
        process.env.USER_REFRESH_TOKEN_EXPIRES_IN!,
      );

      // refreshToken 업데이트
      await tx.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return plainToInstance(UserDTO, { ...user, accessToken });
    });
  }

  /**
   * @name signinWithEmail
   * @param {SignInDTO} data
   * @returns {Promise<TokenDTO>}
   */
  async signinWithEmail(data: SignInDTO): Promise<TokenDTO> {
    const { email, password } = data;

    const user = await this.prisma.user.findFirst({
      where: { auths: { some: { email } } },
      include: {
        auths: {
          where: {
            provider: AuthProvider.EMAIL,
          },
          take: 1,
        },
      },
    });

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    if (!this.authUtil.compareHash(password, user.auths[0].password || ''))
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    if (user?.status === 'WITHDRAWN')
      throw new BadRequestException('탈퇴한 사용자입니다.');
    if (user?.status === 'BLOCKED') {
      throw new BadRequestException('차단된 사용자입니다.');
    }

    const accessToken = this.authUtil.createToken<AccessTokenPayload>(
      {
        id: user.id,
        role: 'USER',
      },
      process.env.USER_ACCESS_TOKEN_EXPIRES_IN!,
    );

    const refreshToken = this.authUtil.createToken<RefreshTokenPayload>(
      {
        id: user.id,
        role: 'USER',
        isRefreshToken: true,
      },
      process.env.USER_REFRESH_TOKEN_EXPIRES_IN!,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * @name signinWithSNS
   * @description sign in with social network service
   * @param {OauthCreateDTO} data
   * @returns {Promise<UserDTO>}
   */
  async signinWithSNS(data: OauthCreateDTO): Promise<UserDTO> {
    const { provider, email, providerId } = data;

    const auth = await this.prisma.auth.findUnique({
      where: {
        provider_email: {
          provider,
          email,
        },
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!auth || !auth.user)
      throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const user = await this.findById(auth.user.id);

    const accessToken = this.authUtil.createToken<AccessTokenPayload>(
      {
        id: user.id,
        role: 'USER',
      },
      process.env.USER_ACCESS_TOKEN_EXPIRES_IN!,
    );

    return plainToInstance(UserDTO, Object.assign(user, { accessToken }));
  }

  /**
   * 회원을 이메일 기반으로 조회합니다.
   * @param {string} email  사용자 이메일
   * @returns {Promise<User>} 사용자 정보
   */
  async findByEmail(email: string) {
    // const user = await this.prisma.user.findFirst({
    //   where: { auths: { some: { email } } },
    //   include: {
    //     blockLogs: {
    //       orderBy: { createdAt: 'desc' },
    //       take: 1,
    //     },
    //     auths: {
    //       omit: {
    //         userId: true,
    //       },
    //     },
    //     withdrawnLogs: {
    //       orderBy: { createdAt: 'desc' },
    //       take: 1,
    //     },
    //   },
    // });
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  /**
   * 회원을 연락처 기반으로 조회합니다.
   * @param {string} contact  사용자 연락처
   * @returns {Promise<User[]>} 사용자 정보
   */
  async findByContact(contact: string) {
    const phoneRegex = /^\d{3}\d{3,4}\d{4}$/;
    if (!phoneRegex.test(contact)) return;

    const user = await this.prisma.user.findUnique({ where: { contact } });

    return user;
  }

  /**
   * 회원을 RefreshToken 기반으로 조회합니다.
   * @param {string} refreshToken  사용자 Refresh Token
   * @returns {Promise<User>} 사용자 정보
   */
  async findByRefreshToken(refreshToken: string) {
    return this.prisma.user.findFirst({
      where: {
        refreshToken,
      },
    });
  }

  async findByContactAndName(data: ContactValidationDTO) {
    const user = await this.prisma.user.findUnique({
      where: { ...data },
      include: {
        auths: {
          omit: {
            password: true,
            userId: true,
          },
        },
      },
    });

    return user;
  }

  /**
   * 회원을 이메일 기반으로 조회합니다.
   * @param {string} email  사용자 이메일
   * @returns {Promise<User>} 사용자 정보
   */
  async findByEmailAndName(data: EmailValidationDTO) {
    const user = await this.prisma.user.findFirst({
      where: { ...data },
      include: {
        auths: {
          omit: {
            password: true,
            userId: true,
          },
        },
      },
    });

    return user;
  }

  /**
   * 회원 가입을 진행합니다.
   * @param data {CreateUserDTO} 사용자 생성 정보
   * @returns  {Promise<User>} 생성된 사용자 정보
   */
  async create(data: CreateUserDTO) {
    const { email, password, confirmPassword, ...rest } = data;

    const defaultPermission = await this.prisma.roleLevelPermission.findFirst({
      where: { default: true },
    });

    if (!defaultPermission) {
      throw new BadRequestException('기본 권한이 존재하지 않습니다.');
    }

    const userByContact = await this.findByContact(data.contact);
    if (userByContact) {
      throw new BadRequestException('이미 사용중인 연락처입니다.');
    }

    const userByEmail = await this.findByEmail(data.email);
    if (userByEmail) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    return this.prisma.user.create({
      data: {
        ...rest,
        email,
        permissionId: defaultPermission.id,
        auths: {
          create: {
            provider: AuthProvider.EMAIL,
            email: email,
            password: hashSync(data.password, 10),
          },
        },
      },
    });
  }
  /**
   * 사용자를 차단합니다.
   */
  async block(id: string) {
    // @todo auth check

    const user = await this.prisma.user.findUnique({ where: { id } });
    const blockExpiry = await this.setting.get('PRIVACY:USER_BLOCKED_PERIOD');

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        blockLogs: {
          create: {
            until: this.dateUtil.addPeriodToToday(
              blockExpiry.value as PeriodString,
            ),
          },
        },
      },
      include: {
        blockLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  /**
   * 사용자 차단을 해제합니다.
   */
  async unblocked(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        blockLogs: {
          where: {
            until: {
              gte: new Date(),
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (user.blockLogs.length === 0) {
      throw new BadRequestException('차단된 사용자가 아닙니다.');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        blockLogs: {
          update: {
            where: {
              id: user.blockLogs[0].id,
            },
            data: {
              until: null,
            },
          },
        },
      },
      include: {
        blockLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  /**
   * 사용자를 탈퇴 처리합니다.
   */
  async withdraw(id: string, data: WithdrawUserDTO) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        withdrawnLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          status: 'WITHDRAWN',
          email: `${new Date().getTime()}__${user.email}`,
          contact: `${new Date().getTime()}__${user.contact}`,
        },
      });

      await tx.auth.deleteMany({
        where: {
          userId: id,
        },
      });
    });

    return this.findById(id);
  }

  /**
   * 사용자를 검색합니다
   * @param option
   * @returns
   */
  async search(option: SearchUserDTO) {
    const { pageNo, pageSize, align, orderBy, query, targetType } = option;

    const where: Prisma.UserWhereInput = {};

    if (targetType) {
      switch (targetType) {
        case 'ACTIVE':
          where.status = 'ACTIVE';
          break;
        case 'BLOCKED':
          where.status = 'BLOCKED';
          break;
        case 'WITHDRAWN':
          where.status = 'WITHDRAWN';
          break;
        default:
          break;
      }
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { contact: { contains: query, mode: 'insensitive' } },
      ];
    }

    const order = {
      [orderBy || 'createdAt']: align || 'desc',
    };

    const count = await this.prisma.user.count({ where });

    const items = await this.prisma.user.findMany({
      where,
      orderBy: order,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      include: { auths: true },
    });

    return {
      items: plainToInstance(UserDTO, items),
      pageInfo: {
        pageNo,
        pageSize,
        pageItems: items.length,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
      },
    };
  }

  /**
   * 사용자 차단 상태를 토글합니다.
   * @param id
   */
  async toggleBlock(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        status: user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
      },
    });

    return this.findById(id);
  }

  /**
   * 회원의 탈퇴 요청을 취소(복구)합니다.
   * @param {string} id 사용자 ID
   * @returns {Promise<User>} 사용자 정보
   */
  async unwithdraw(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        withdrawnLogs: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (
      user.withdrawnLogs.length === 0 ||
      user.withdrawnLogs[0].until === null
    ) {
      throw new BadRequestException('탈퇴한 사용자가 아닙니다.');
    }

    if (user.withdrawnLogs[0].until < new Date()) {
      throw new BadRequestException('재가입 가능 기간이 지났습니다.');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        withdrawnLogs: {
          update: {
            where: {
              id: user.withdrawnLogs[0].id,
            },
            data: {
              until: null,
            },
          },
        },
      },
      include: {
        withdrawnLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  /**
   * @description 사용자 정보를 수정합니다.
   * @param {string} id  사용자 ID
   * @param {UpdateUserDTO} data  사용자 수정 정보
   * @returns
   */
  async update(id: string, data: UpdateUserDTO) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        contact: true,
        auths: {
          orderBy: {
            createdAt: Prisma.SortOrder.desc,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const checkContact = await this.prisma.user.count({
      where: {
        contact: data.contact,
      },
    });

    const checkEmail = await this.prisma.user.count({
      where: {
        email: data.email,
      },
    });

    if (checkContact > 1)
      throw new BadRequestException('이미 사용중인 연락처입니다.');

    if (checkEmail > 1)
      throw new BadRequestException('이미 사용중인 이메일입니다.');

    const updatedData: Prisma.UserUpdateInput = {
      ...data,
      name: data.name,
      email: data.email,
      contact: data.contact || user.contact,
    };

    return await this.prisma.$transaction(async (tx) => {
      for (const auth of user.auths) {
        await tx.auth.update({
          where: {
            provider_email: {
              provider: auth.provider,
              email: auth.email || data.email,
            },
          },
          data: {
            email: updatedData?.email,
          },
        });
      }

      return await tx.user.update({ where: { id }, data: updatedData });
    });
  }

  /**
   * @name resetPassword
   * @description reset user password using a token
   * @param {UpdatePasswordDTO} data
   * @returns {Promise<boolean>}
   */
  async resetPassword(data: UpdatePasswordDTO): Promise<boolean> {
    const { password, confirmedPassword, token } = data;
    if (!token) throw new BadRequestException('올바르지 않은 요청입니다.1');

    try {
      const payload: ResetPasswordTokenDTO =
        this.authUtil.verifyToken<ResetPasswordTokenDTO>(token);

      if (password !== confirmedPassword)
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');

      return await this.prisma.$transaction(async (tx) => {
        const auth = await tx.auth.findFirst({
          where: {
            provider: AuthProvider.EMAIL,
            email: payload.email,
          },
        });

        if (!auth) throw new NotFoundException('사용자를 찾을 수 없습니다.');

        await tx.auth.update({
          where: { id: auth.id },
          data: {
            password: hashSync(password, parseInt(process.env.HASH_SALT!)),
          },
        });

        return true;
      });
    } catch (error) {
      throw new BadRequestException('올바르지 않은 요청입니다.');
    }
  }

  /**
   * @name updatePassword
   * @description update user`s own password
   * @param {string} userId
   * @param {UpdatePasswordDTO} data
   * @returns  {Promise<boolean>}
   */
  async updatePassword(
    userId: string,
    data: UpdatePasswordDTO,
  ): Promise<boolean> {
    const { oldPassword, password, confirmedPassword } = data;
    if (password !== confirmedPassword)
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        auths: {
          where: {
            provider: AuthProvider.EMAIL,
          },
          take: 1,
        },
      },
    });

    return await this.prisma.$transaction(async (tx) => {
      if (!user || !user.auths || !user?.auths?.length)
        throw new NotFoundException('사용자를 찾을 수 없습니다.');

      if (
        !oldPassword ||
        !this.authUtil.compareHash(oldPassword, user.auths[0].password || '')
      )
        throw new BadRequestException('기존 비밀번호가 일치하지 않습니다.');

      const id = user.auths[0].id;

      await tx.auth.update({
        where: {
          id,
        },
        data: {
          password: hashSync(password, parseInt(process.env.HASH_SALT!)),
        },
      });

      return true;
    });
  }

  /**
   * 사용자의 연락처를 변경합니다.
   */
  async updateContact(id: string, contact: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const exists = await this.prisma.user.findUnique({ where: { contact } });

    if (exists) {
      throw new BadRequestException('이미 사용중인 연락처입니다.');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        contact,
      },
    });
  }

  /**
   * 사용자 리프레쉬 토큰을 업데이트합니다.
   */
  async setRefreshToken(id: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
  }

  /**
   * 사용자를 삭제합니다.
   * @param {string} id  사용자 ID
   * @returns {Promise<User>} 삭제된 사용자 정보
   */
  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return this.prisma.user.delete({ where: { id } });
  }

  /**
   * 사용자 다중 영구 삭제
   */
  async deleteMany(data: { ids: string[] }) {
    return this.prisma.user.deleteMany({
      where: {
        id: {
          in: data.ids,
        },
      },
    });
  }

  /**
   * @name sendEmail
   * @description Sends an email with a verification code
   * @param {EmailValidationDTO} data
   * @returns {Promise<{ token: string }>}
   */
  async sendEmail(data?: EmailValidationDTO): Promise<{ token: string }> {
    const code = randomInt(100000, 999999).toString();

    Logger.debug(`code : [${code}]`);
    if (data?.name) {
      const user = await this.findByEmailAndName(data);
      if (!user) {
        throw new BadRequestException(
          '입력하신 정보와 일치하는 사용자가 없습니다.',
        );
      }
    }

    const filePath = path.join(process.cwd(), 'assets', 'send-code.html');
    let emailTemplate = fs.readFileSync(filePath, 'utf8');

    const title = `[${process.env.SERVICE_NAME}] 이메일 인증 코드`;
    const TEXT1 = '인증번호는';
    const TEXT2 = '입니다.';
    const TEXT3 = '해당 인증번호를 입력해주세요.';
    const TEXT4 =
      '본 메일은 발신전용으로 고객사명 고객님께 알려드리는 안내메일입니다.';
    const TEXT5 = '문의사항은 홈페이지 또는 고객센터를 이용하시기 바랍니다.';
    const TEXT6 = '상호명';
    const businessInfo = await this.prisma.businessInfo.findFirst();
    const COMPANY_NAME = businessInfo?.businessName || '비들리';
    const ADDRESS = `주소: ${businessInfo?.address || '비들리 주소'}`;
    const BUSINESS_NUMBER = `사업자 등록번호: ${businessInfo?.businessRegistrationNumber || '123-123-1234'}`;
    const CONTACT = `대표전화: ${businessInfo?.contact || '02-1234-1234'}`;
    const CEO = `대표: ${businessInfo?.representativeName || '비들리 대표'}`;

    emailTemplate = emailTemplate.replace('{{ code }}', code);
    emailTemplate = emailTemplate.replace(/\[\{\{ TITLE \}\}\]/g, title);
    emailTemplate = emailTemplate.replace(/\[\{\{ TEXT1 \}\}\]/g, TEXT1);
    emailTemplate = emailTemplate.replace(/\[\{\{ TEXT2 \}\}\]/g, TEXT2);
    emailTemplate = emailTemplate.replace(/\[\{\{ TEXT3 \}\}\]/g, TEXT3);
    emailTemplate = emailTemplate.replace(/\[\{\{ TEXT4 \}\}\]/g, TEXT4);
    emailTemplate = emailTemplate.replace(/\[\{\{ TEXT5 \}\}\]/g, TEXT5);
    emailTemplate = emailTemplate.replace(/\[\{\{ TEXT6 \}\}\]/g, TEXT6);
    emailTemplate = emailTemplate.replace(
      /\[\{\{ COMPANY_NAME \}\}\]/g,
      COMPANY_NAME,
    );
    emailTemplate = emailTemplate.replace(/\[\{\{ ADDRESS \}\}\]/g, ADDRESS);
    emailTemplate = emailTemplate.replace(
      /\[\{\{ BUSINESS_NUMBER \}\}\]/g,
      BUSINESS_NUMBER,
    );
    emailTemplate = emailTemplate.replace(/\[\{\{ CONTACT \}\}\]/g, CONTACT);
    emailTemplate = emailTemplate.replace(/\[\{\{ CEO \}\}\]/g, CEO);

    await this.emailService.send({
      title,
      body: emailTemplate,
      receiver: data.email,
    });

    const token = this.authUtil.createToken(
      {
        email: data.email,
        code,
      },
      '3m',
    );

    return { token };
  }
}
