import { ApiProperty } from '@nestjs/swagger';

/**
 * NHN Cloud 서비스 공통 Response Header 타입
 * @author 최강훈 <ganghun@lepisode.team>
 */
export class NHNCloudCommonResponseHeader {
  @ApiProperty({ description: '응답 코드' })
  resultCode: number;
  @ApiProperty({ description: '응답 메시지' })
  resultMessage: 'success';
  @ApiProperty({ description: '성공 여부' })
  isSuccessful: boolean;
}

/**
 * NHN Cloud 서비스 공통 Response 타입
 * @author 최강훈 <ganghun@lepisode.team>
 */
export class NHNCloudCommonResponse<T> {
  @ApiProperty({ type: NHNCloudCommonResponseHeader })
  header: NHNCloudCommonResponseHeader;
  @ApiProperty({
    description: '응답 데이터',
    examples: [{ data: {} }, { data: [] }],
  })
  body: {
    data: T;
  };
}
