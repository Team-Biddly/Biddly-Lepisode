/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

dotenv.config();

@Injectable()
export class InputValidationMiddleware implements NestMiddleware {
  private readonly ALLOWED_TAGS = [
    "p",
    "br",
    "b",
    "i",
    "u",
    "strong",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "span",
    "div",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ];

  private readonly ALLOWED_ATTRIBUTES = {
    div: ["class"],
    span: ["class"],
    p: ["class"],
    table: ["class"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan"],
  };

  private readonly XSS_PATTERNS: RegExp[] = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror=/gi,
    /onload=/gi,
    /onmouseover=/gi,
    /onclick=/gi,
    /onmouseout=/gi,
    /onsubmit=/gi,
    /onchange=/gi,
    /expression\(/gi,
    /alert\(/gi,
  ];

  use(req: Request, res: Response, next: NextFunction): void {
    this.validateRequest(req);
    next();
  }

  /**
   * 요청 유효성 검사
   * @param req
   */
  private validateRequest(req: Request): void {
    if (req.body) {
      this.sanitizeAndValidateObject(req, "body"); // body 유효성 검사
    }

    if (req.query) {
      this.sanitizeAndValidateObject(req, "query"); // query 유효성 검사
    }

    if (req.params) {
      this.sanitizeAndValidateObject(req, "params"); // params 유효성 검사
    }
  }

  /**
   * 객체 유효성 검사
   * @param req
   * @param key
   */
  private sanitizeAndValidateObject(
    req: Request,
    key: "body" | "query" | "params",
  ): void {
    Object.keys(req[key]).forEach((field) => {
      const value = req[key][field];

      if (typeof value === "string") {
        if (this.containsXssPattern(value)) {
          throw new BadRequestException(`❗ XSS 패턴 감지 ${field} 필드`);
        }

        const sanitizedValue = this.sanitizeHtmlContent(value);

        if (sanitizedValue !== value) {
          throw new BadRequestException(`❗ HTML 태그가 제거된 ${field} 필드`);
        }
      }

      if (typeof value === "object" && value !== null) {
        this.deepValidateObject(value);
      }
    });
  }

  /**
   * 객체 깊이 유효성 검사
   * @param obj
   */
  private deepValidateObject(obj: any): void {
    if (Array.isArray(obj)) {
      obj.forEach((item) => this.validateItem(item));
    } else if (typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((key) => this.validateItem(obj[key]));
    }
  }

  /**
   * 개별 항목 유효성 검사
   * @param item
   */
  private validateItem(item: any): void {
    if (typeof item === "string") {
      if (this.containsXssPattern(item)) {
        throw new BadRequestException(`❗ XSS 패턴 감지 ${item} 필드`);
      }
    } else if (typeof item === "object" && item !== null) {
      this.deepValidateObject(item);
    }
  }

  /**
   * XSS 패턴 검사
   * @param value
   * @returns
   */
  private containsXssPattern(value: string): boolean {
    return this.XSS_PATTERNS.some((pattern) => pattern.test(value));
  }

  /**
   * HTML 파싱
   * @param html
   * @returns
   */
  private sanitizeHtmlContent(html: string): string {
    return sanitizeHtml(html, {
      allowedTags: this.ALLOWED_TAGS, // 허용된 태그만 남기고 sanitize
      allowedAttributes: this.ALLOWED_ATTRIBUTES, // 허용된 속성만 남기고 sanitize
      disallowedTagsMode: "escape", // 허용되지 않은 태그는 이스케이프
      allowedSchemesByTag: {},
      selfClosing: [],
      parser: {
        decodeEntities: true,
      },
    });
  }
}
