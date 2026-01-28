import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SmsModule } from './sms/sms.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { CipherModule } from './cipher/cipher.module';
import { UserModule } from './user/user.module';
import { OAuthModule } from './oauth/oauth.module';
import { StorageModule } from './storage/storage.module';
import { SettingModule } from './setting/setting.module';
import { InquiryModule } from './customer/inquiry/inquiry.module';
import { FaqModule } from './faq/faq.module';
import { NoticeModule } from './customer/notice/notice.module';
import { HealthModule } from './health/health.module';
import { VisitorModule } from './visitor/visitor.module';
import { UserManagementModule } from './user-management/user-management.module';
import { AdminModule } from './admin/admin.module';
import { PolicyModule } from './policy/policy.module';
import { BusinessInfoModule } from './business-info/business-info.module';
import { DocumentModule } from './document/document.module';
import { AiModule } from './ai/ai.module';
import { BannerModule } from './banner/banner.module';
import { StatisticModule } from './statistic/statistic.module';
import { LogModule } from './log/log.module';
import { OpenAPIModule } from './open-api/open-api.module';
import { OrderPlanModule } from './order-plan/order-plan.module';
import { BidModule } from './bid/bid.module';
import { PreStandardModule } from './pre-standard/pre-standard.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MenuModule,
    PrismaModule,
    CacheModule.register({ isGlobal: true }),
    EventEmitterModule.forRoot({
      global: true,
      delimiter: '.',
      ignoreErrors: true,
    }),
    ScheduleModule.forRoot(),
    SmsModule.forRoot({
      provider: 'nhn-cloud',
      config: {
        appKey: process.env.NHN_CLOUD_SMS_APP_KEY,
        secretKey: process.env.NHN_CLOUD_SMS_SECRET_KEY,
        sendNo: process.env.NHN_CLOUD_SMS_SEND_NO,
      },
    }),
    EmailModule.forRoot({
      provider: 'nhn-cloud',
      config: {
        appKey: process.env.NHN_CLOUD_EMAIL_APP_KEY,
        secretKey: process.env.NHN_CLOUD_EMAIL_SECRET_KEY,
        sender: process.env.NHN_CLOUD_EMAIL_SENDER,
        senderName: process.env.SERVICE_NAME,
      },
    }),
    AuthModule,
    CipherModule.forRoot({
      key: process.env.SYMMETRIC_KEY,
      iv: process.env.IV,
    }),
    /** Swagger 순서 시작 */
    UserModule,
    OAuthModule.forRoot({
      providers: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          redirectUri: process.env.GOOGLE_REDIRECT_URI,
        },
        kakao: {
          clientId: process.env.KAKAO_CLIENT_ID,
          redirectUri: process.env.KAKAO_REDIRECT_URI,
        },
      },
    }),
    StorageModule.forRoot({
      accessKey: process.env.STORAGE_ACCESS_KEY,
      secretKey: process.env.STORAGE_SECRET_KEY,
      endpoint: process.env.STORAGE_ENDPOINT,
      bucketName: process.env.STORAGE_BUCKET_NAME,
      region: process.env.STORAGE_REGION,
    }),
    SettingModule.forRoot({
      settings: {
        'PRIVACY:USER_DATA_PERIOD': '2y',
        'PRIVACY:USER_WITHDRAWN_PERIOD': '10d',
        'PRIVACY:USER_BLOCKED_PERIOD': '14d',
      },
      disabled: {
        'PRIVACY:USER_DATA_PERIOD': true,
      },
    }),
    InquiryModule,
    FaqModule,
    NoticeModule,
    HealthModule,
    VisitorModule,
    UserManagementModule,
    AdminModule,
    PolicyModule,
    BusinessInfoModule,
    DocumentModule,
    AiModule.register({
      apiKey: process.env.OPENAI_API_KEY,
    }),
    BannerModule,
    StatisticModule,
    LogModule,
    OpenAPIModule.register({
      serviceKey: process.env.OPENAPI_SERVICE_KEY,
    }),
    OrderPlanModule,
    BidModule,
    PreStandardModule,
    BookmarkModule,
  ],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly appService: AppService) {}
}
