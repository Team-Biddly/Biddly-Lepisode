import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthUtil } from './auth.util';
import { AuthGuard } from './guards/auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  providers: [AuthGuard, AuthUtil],
  exports: [AuthGuard, AuthUtil],
})
export class AuthModule {}
