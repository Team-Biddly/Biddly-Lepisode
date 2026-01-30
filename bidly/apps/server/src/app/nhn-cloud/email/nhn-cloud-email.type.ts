/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";
import dayjs from "dayjs";

export class NHNCloudEmailRequestListDTO {
  @ApiProperty({
    description: "조회 시작일",
    example: new Date(),
    required: true,
  })
  @IsNotEmpty({ message: "조회 시작일을 입력해 주세요." })
  @IsISO8601({}, { message: "올바르지 않은 날짜 형식 입니다." })
  startSendDate: string;

  @ApiProperty({
    description: "조회 종료일",
    example: new Date(),
    required: true,
  })
  @IsNotEmpty({ message: "조회 종료일을 입력해 주세요." })
  @IsISO8601({}, { message: "올바르지 않은 날짜 형식 입니다." })
  endSendDate: string;

  @ApiProperty({ description: "페이지 번호", example: "1", required: false })
  @IsOptional()
  pageNum?: number;

  @ApiProperty({ description: "페이지 크기", example: "15", required: false })
  @IsOptional()
  pageSize?: number;
}

@Expose()
export class NHNCloudEmailListResponseDTO {
  requestId: string;
  mailSeq: number;
  requestDate: string;
  templateId: string;
  templateName: string;
  senderName: string;
  senderAddress: string;
  title: string;
  body: string;
  mailStatusCode: string;
  mailStatusName: string;
  isReceived: boolean;
  resultDate: string;
  isOpened: boolean;
  openedDate: string;
  receiveMailAddr: string;
  receiveType: string;
  receiveTypeName: string;
  receiveName: string;
  senderGroupingKey: string;
  dsnCode: string;
  dsnMessage: string;
}

@Expose()
export class NHNCloudEmailResponseDTO {
  requestId: string;
  mailSeq: number;
  requestIp: string;
  requestDate: string;
  mailStatusCode: string;
  mailStatusName: string;
  templateId: string;
  templateName: string;
  senderName: string;
  senderAddress: string;
  resultId: string;
  title: string;
  body: string;
  receiverList: {
    requestId: string;
    mailSeq: number;
    receiveType: string;
    receiveTypeName: string;
    receiveName: string;
    receiveMailAddr: string;
    isReceived: boolean;
    resultDate: string;
    isOpened: boolean;
    openedDate: string;
    dsnCode: string;
    dsnMessage: string;
  }[];
  attachFileList: {
    fileType: string;
    fileId: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    createDate: string;
  }[];
  customHeaders: {
    [key: string]: string;
  };
  senderGroupingKey: string;
}

/** NHN 클라우드 이메일 수신자 타입 */
export const NHNCloudEmailReceiveType = {
  /** 받는 사람 */ MRT0: "MRT0",
  /** 참조 */ MRT1: "MRT1",
  /** 숨은 참조 */ MRT2: "MRT2",
} as const;

export class NHNCloudEmailReceipientDTO {
  @ApiProperty({ description: "" })
  @IsNotEmpty({ message: "수신 주소를 입력해 주세요." })
  receiveMailAddr: string;
  @ApiProperty({ description: "" })
  @IsOptional()
  receiveName?: string;
  @ApiProperty({
    description: "수신 유형",
    required: true,
    enum: NHNCloudEmailReceiveType,
    enumName: "수신 유형",
  })
  @IsNotEmpty({ message: "수신 유형을 선택해 주세요" })
  receiveType: (typeof NHNCloudEmailReceiveType)[keyof typeof NHNCloudEmailReceiveType];
}

/**
 * NHN Cloud 이메일 전송 요청 Request 타입
 * @see https://docs.nhncloud.com/ko/Notification/Email/ko/api-guide/#_2
 
 */
export class NHNCloudEmailSendRequestDTO {
  @IsOptional()
  @ApiProperty({ description: "발신 주소", required: false })
  senderAddress?: string;

  @IsOptional()
  @ApiProperty({ description: "발신자 명", required: false })
  senderName?: string;

  @IsOptional()
  @ApiProperty({
    description: "발신 요청일",
    required: false,
    example: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  })
  requestDate?: string;

  @IsOptional()
  @ApiProperty({ description: "메일 제목", required: false })
  title?: string;

  @IsOptional()
  @ApiProperty({ description: "메일 내용", required: false })
  body?: string;

  @ApiProperty({
    type: NHNCloudEmailReceipientDTO,
    isArray: true,
    minLength: 1,
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1, { message: "수신자를 최소 1명 이상 입력해 주세요." })
  @ArrayMaxSize(1000, { message: "수신자는 최대 1000명까지 입력 가능합니다." })
  @Type(() => NHNCloudEmailReceipientDTO)
  @ValidateNested({ each: true })
  receiverList: NHNCloudEmailReceipientDTO[];

  @IsOptional()
  @ApiProperty({ description: "사용 템플릿 ID", required: false })
  templateId?: string;

  @IsOptional()
  @ApiProperty({
    description: "템플릿 유형",
    default: "DEFAULT",
    required: false,
  })
  templateType?: "DEFAULT" | "FREEMARKER" = "DEFAULT";

  @IsOptional()
  @ApiProperty({ description: "템플릿 치환 파라미터 ", required: false })
  templateParameter?: Record<string, any>;

  @IsOptional()
  @ApiProperty({ description: "발송 구분자 ", required: false })
  userId?: string;
}

/**
 * NHN Cloud 이메일 전송 성공 결과 Response 타입
 * @see https://docs.nhncloud.com/ko/Notification/Email/ko/api-guide/#_2
 */
export class NHNCloudEmailSendResponseDTO {
  requestId: string;
  results: {
    receiveMailAddr: string;
    receiveName: string;
    receiveType: string;
    resultCode: string;
    resultMessage: string;
  }[];
}
