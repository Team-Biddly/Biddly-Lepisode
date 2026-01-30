import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { OpenAPIModuleOptions } from '../open-api.module';
import { OPENAPI_MODULE_OPTIONS } from '../open-api.module.const';
import { OpenAPIResponse } from '../types/openapi.response.type';
import { PreStandardListRequestParams } from './types/pre-standard-list.request.type';
import { OpenAPIPreStandardOpinion } from './types/pre-standard-opinion.type';
import { PreStandard_Thing } from './types/pre-standard-thing.type';

const PRE_STD_LIST_THING_OPERATION = 'getPublicPrcureThngInfoThng';
const PRE_STD_LIST_FOREIGN_OPERATION = 'getPublicPrcureThngInfoFrgcpt';
const PRE_STD_LIST_SERVICE_OPERATION = 'getPublicPrcureThngInfoServc';
const PRE_STD_LIST_CONSTRUCTION_OPERATION = 'getPublicPrcureThngInfoCnstwk';

const PRE_STD_LIST_THING_OPINION_OPERATION =
  'getPublicPrcureThngOpinionInfoThng';
const PRE_STD_LIST_FOREIGN_OPINION_OPERATION =
  'getPublicPrcureThngOpinionInfoFrgcpt';
const PRE_STD_LIST_SERVICE_OPINION_OPERATION =
  'getPublicPrcureThngOpinionInfoServc';
const PRE_STD_LIST_CONSTRUCTION_OPINION_OPERATION =
  'getPublicPrcureThngOpinionInfoCnstwk';

/**
 * 조달청_나라장터 사전규격정보서비스
 * @see https://www.data.go.kr/data/15129437/openapi.do
 * @author 최강훈 <ganghun@lepisode.team>
 */
@Injectable()
export class OpenAPIPreStandardService {
  private readonly endpoint =
    'https://apis.data.go.kr/1230000/ao/HrcspSsstndrdInfoService';

  constructor(
    @Inject(OPENAPI_MODULE_OPTIONS)
    private readonly options: OpenAPIModuleOptions,
    private readonly http: HttpService,
  ) {}

  /**
   * 사전규격정보에 대한 물품조회
   * @serviceName getPublicPrcureThngInfoThng
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getPreStdThingList(params: PreStandardListRequestParams) {
    const url = `${this.endpoint}/${PRE_STD_LIST_THING_OPERATION}`;

    try {
      const res = await this.http.axiosRef.get<
        OpenAPIResponse<PreStandard_Thing>
      >(url, {
        params: {
          serviceKey: this.options.serviceKey,
          type: 'json',
          ...params,
        },
      });

      if (res?.data?.response?.header?.resultCode !== '00') {
        throw new Error('사전규격정보에 대한 물품 조회중 오류가 발생했습니다.');
      }

      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error('사전규격정보에 대한 물품 조회중 오류가 발생했습니다.');
    }
  }

  /**
   * 사전규격정보에 대한 외자조회
   * @serviceName getPublicPrcureThngInfoFrgcpt
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getPreStdForeignList(params: PreStandardListRequestParams) {
    const url = `${this.endpoint}/${PRE_STD_LIST_FOREIGN_OPERATION}`;

    const res = await this.http.axiosRef.get<
      OpenAPIResponse<PreStandard_Thing>
    >(url, {
      params: {
        serviceKey: this.options.serviceKey,
        type: 'json',
        ...params,
      },
    });

    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('사전규격정보에 대한 외자 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }

  /**
   * 사전규격정보에 대한 용역조회
   * @serviceName getPublicPrcureThngInfoServc
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getPreStdServiceList(params: PreStandardListRequestParams) {
    const url = `${this.endpoint}/${PRE_STD_LIST_SERVICE_OPERATION}`;

    const res = await this.http.axiosRef.get<
      OpenAPIResponse<PreStandard_Thing>
    >(url, {
      params: {
        serviceKey: this.options.serviceKey,
        type: 'json',
        ...params,
      },
    });

    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('사전규격정보에 대한 용역 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }

  /**
   * 사전규격정보에 대한 공사조회
   * @serviceName getPublicPrcureThngInfoCnstwk
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getPreStdConstructionList(params: PreStandardListRequestParams) {
    const url = `${this.endpoint}/${PRE_STD_LIST_CONSTRUCTION_OPERATION}`;

    const res = await this.http.axiosRef.get<
      OpenAPIResponse<PreStandard_Thing>
    >(url, {
      params: {
        serviceKey: this.options.serviceKey,
        type: 'json',
        ...params,
      },
    });

    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('사전규격정보에 대한 공사 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }

  /**
   * 나라장터 사전규격 물품 규격서 의견 목록 조회
   * @serviceName getPublicPrcureThngOpinionInfoThng
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getPreStdThingOpinionList(params: PreStandardListRequestParams) {
    const url = `${this.endpoint}/${PRE_STD_LIST_THING_OPINION_OPERATION}`;

    const res = await this.http.axiosRef.get<
      OpenAPIResponse<OpenAPIPreStandardOpinion>
    >(url, {
      params: {
        serviceKey: this.options.serviceKey,
        type: 'json',
        ...params,
      },
    });

    if (!res.data.response) {
      throw new Error('사전규격 물품 규격서 의견 조회중 응답이 없습니다.');
    }

    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('사전규격 물품 규격서 의견 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }

  /**
   * 나라장터 사전규격 외자 규격서 의견 목록 조회
   * @serviceName getPublicPrcureThngOpinionInfoFrgcpt
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getPreStdForeignOpinionList(params: PreStandardListRequestParams) {
    const url = `${this.endpoint}/${PRE_STD_LIST_FOREIGN_OPINION_OPERATION}`;

    const res = await this.http.axiosRef.get<
      OpenAPIResponse<OpenAPIPreStandardOpinion>
    >(url, {
      params: {
        serviceKey: this.options.serviceKey,
        type: 'json',
        ...params,
      },
    });

    if (!res.data.response) {
      throw new Error('사전규격 외자 규격서 의견 조회중 응답이 없습니다.');
    }

    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('사전규격 외자 규격서 의견 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }

  /**
   * 나라장터 사전규격 용역 규격서 의견 목록 조회
   * @serviceName getPublicPrcureThngOpinionInfoServc
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getPreStdServiceOpinionList(params: PreStandardListRequestParams) {
    const url = `${this.endpoint}/${PRE_STD_LIST_SERVICE_OPINION_OPERATION}`;

    const res = await this.http.axiosRef.get<
      OpenAPIResponse<OpenAPIPreStandardOpinion>
    >(url, {
      params: {
        serviceKey: this.options.serviceKey,
        type: 'json',
        ...params,
      },
    });
    if (!res.data.response) {
      throw new Error('사전규격 용역 규격서 의견 조회중 응답이 없습니다.');
    }
    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('사전규격 용역 규격서 의견 조회중 오류가 발생했습니다.');
    }
    return res.data;
  }

  /**
   * 나라장터 사전규격 공사 규격서 의견 목록 조회
   * @serviceName getPublicPrcureThngOpinionInfoCnstwk
   * @author 최강훈 <
   */
  async getPreStdConstructionOpinionList(params: PreStandardListRequestParams) {
    const url = `${this.endpoint}/${PRE_STD_LIST_CONSTRUCTION_OPINION_OPERATION}`;
    const res = await this.http.axiosRef.get<
      OpenAPIResponse<OpenAPIPreStandardOpinion>
    >(url, {
      params: {
        serviceKey: this.options.serviceKey,
        type: 'json',
        ...params,
      },
    });
    if (!res.data.response) {
      throw new Error('사전규격 공사 규격서 의견 조회중 응답이 없습니다.');
    }
    if (res?.data?.response?.header?.resultCode !== '00') {
      throw new Error('사전규격 공사 규격서 의견 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }
}
