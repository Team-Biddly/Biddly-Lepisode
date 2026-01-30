import { UserRole } from '../const/user-role.const';

export type AccessTokenPayload = {
  id: string;
  role: UserRole;
};

export type RefreshTokenPayload = {
  id: string;
  role: UserRole;
  isRefreshToken: true;
};
