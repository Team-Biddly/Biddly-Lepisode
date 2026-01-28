import { doubleCsrf } from "csrf-csrf";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  // 키 생성 커맨드 : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: "XSRF-TOKEN",
  cookieOptions: {
    httpOnly: isProduction,
    sameSite: "strict",
    secure: isProduction,
    path: "/",
  },
  size: 64, // Token size
  // ignoredMethods: ["GET", "HEAD", "OPTIONS"], // 앱 모듈 수준에서 정의합니다.
  getTokenFromRequest: (req: Request) => req.headers["x-xsrf-token"] as string, // 요청에서 CSRF 토큰을 가져오는 방법을 설정합니다.
});

/**
 * 토큰기반 CSRF 보호 미들웨어
 * @param req
 * @param res
 * @param next
 */
export function CsrfMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = generateToken(req, res);
  // 생성된 CSRF 토큰을 쿠키에 저장
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: isProduction,
    sameSite: "strict",
    secure: isProduction,
    path: "/",
  });
  // 생성된 토큰을 응답 헤더에 설정
  res.setHeader("XSRF-TOKEN", token);
  next();
}

export { doubleCsrfProtection };

