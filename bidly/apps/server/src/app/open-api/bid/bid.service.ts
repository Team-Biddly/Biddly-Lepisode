import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { OpenAPIModuleOptions } from '../open-api.module';
import { OPENAPI_MODULE_OPTIONS } from '../open-api.module.const';
import { OpenAPIResponse } from '../types/openapi.response.type';
import { Bid_Construction } from './types/bid-construction.type';
import { Bid_Etc } from './types/bid-etc.type';
import { Bid_Foreign } from './types/bid-foreign.type';
import { BidListRequestParams } from './types/bid-list.request.type';
import { Bid_Service } from './types/bid-service.type';
import { Bid_Thing } from './types/bid-thing.type';

const BASE_URL = 'http://apis.data.go.kr/1230000/ad/BidPublicInfoService';
const BID_LIST_CONSTRUCTION_SERVICE_NAME = 'getBidPblancListInfoCnstwk';
const BID_LIST_THING_SERVICE_NAME = 'getBidPblancListInfoThng';
const BID_LIST_SERVICE_SERVICE_NAME = 'getBidPblancListInfoServc';
const BID_LIST_FOREIGN_SERVICE_NAME = 'getBidPblancListInfoFrgcpt';
const BID_LIST_ETC_SERVICE_NAME = 'getBidPblancListInfoEtc';

/**
 * 조달청_나라장터 입찰공고정보서비스
 * @see https://www.data.go.kr/data/15129394/openapi.do
 * @author 최강훈 <ganghun@lepisode.team>
 */
@Injectable()
export class OpenAPIBidService {
  constructor(
    @Inject(OPENAPI_MODULE_OPTIONS)
    private readonly options: OpenAPIModuleOptions,
    private readonly http: HttpService,
  ) {}

  /**
   * 입찰공고목록 정보에 대한 공사조회
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getBidConstructionList(params: BidListRequestParams) {
    const url = `${BASE_URL}/${BID_LIST_CONSTRUCTION_SERVICE_NAME}`;

    const res = await this.http.axiosRef.get<OpenAPIResponse<Bid_Construction>>(
      url,
      {
        params: {
          serviceKey: this.options.serviceKey,
          type: 'json',
          ...params,
        },
      },
    );

    if (!res.data.response) {
      throw new BadGatewayException(
        '입찰공고정보에 대한 건설공사 조회중 응답이 없습니다.',
      );
    }

    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new BadGatewayException(
        '입찰공고정보에 대한 건설공사 조회중 오류가 발생했습니다.',
      );
    }

    return res.data;
  }

  /**
   * 	입찰공고목록 정보에 대한 물품조회
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getBidThingList(params: BidListRequestParams) {
    const url = `${BASE_URL}/${BID_LIST_THING_SERVICE_NAME}`;

    try {
      const res = await this.http.axiosRef.get<OpenAPIResponse<Bid_Thing>>(
        url,
        {
          params: {
            serviceKey: this.options.serviceKey,
            type: 'json',
            ...params,
          },
        },
      );

      if (!res.data.response) {
        throw new BadGatewayException(
          '입찰공고정보에 대한 물품 조회중 응답이 없습니다.',
        );
      }

      if (res?.data?.response?.header?.resultCode !== '00') {
        throw new BadGatewayException(
          '입찰공고정보에 대한 물품 조회중 오류가 발생했습니다.',
        );
      }

      return res.data;
    } catch (error) {
      console.error(error);
      throw new BadGatewayException(
        '입찰공고정보에 대한 물품 조회중 오류가 발생했습니다.',
      );
    }
  }

  /**
   * 입찰공고목록 정보에 대한 용역조회
   * @author 최강훈 <
   */
  async getBidServiceList(params: BidListRequestParams) {
    const url = `${BASE_URL}/${BID_LIST_SERVICE_SERVICE_NAME}`;

    const res = await this.http.axiosRef.get<OpenAPIResponse<Bid_Service>>(
      url,
      {
        params: {
          serviceKey: this.options.serviceKey,
          type: 'json',
          ...params,
        },
      },
    );

    if (!res.data.response) {
      throw new Error('입찰공고정보에 대한 용역 조회중 응답이 없습니다.');
    }

    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('입찰공고정보에 대한 용역 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }

  /**
   * 입찰공고목록 정보에 대한 외자조회
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getBidForeignList(params: BidListRequestParams) {
    const url = `${BASE_URL}/${BID_LIST_FOREIGN_SERVICE_NAME}`;

    const res = await this.http.axiosRef.get<OpenAPIResponse<Bid_Foreign>>(
      url,
      {
        params: {
          serviceKey: this.options.serviceKey,
          type: 'json',
          ...params,
        },
      },
    );

    if (!res.data.response) {
      throw new Error('입찰공고정보에 대한 외자 조회중 응답이 없습니다.');
    }

    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('입찰공고정보에 대한 외자 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }

  async getBidEtcList(params: BidListRequestParams) {
    const url = `${BASE_URL}/${BID_LIST_ETC_SERVICE_NAME}`;

    const res = await this.http.axiosRef.get<OpenAPIResponse<Bid_Etc>>(url, {
      params: {
        serviceKey: this.options.serviceKey,
        type: 'json',
        ...params,
      },
    });

    if (!res.data.response) {
      throw new Error('입찰공고정보에 대한 기타 조회중 응답이 없습니다.');
    }

    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('입찰공고정보에 대한 기타 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }
}
