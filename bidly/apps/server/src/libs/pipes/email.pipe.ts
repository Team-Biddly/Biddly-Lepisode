import { BadRequestException, PipeTransform } from "@nestjs/common";
import { unescape } from "querystring";

export class EmailPipe implements PipeTransform {
  transform(value: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
      throw new BadRequestException("이메일 형식이 아닙니다.");
    }

    return unescape(value);
  }
}
