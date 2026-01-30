import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { OpenAPIModuleOptions } from '../open-api.module';
import { OPENAPI_MODULE_OPTIONS } from '../open-api.module.const';
import { OpenAPIResponse } from '../types/openapi.response.type';
import { OrderPlan_Foreign } from './types/order-plan-foreign.type';
import { OrderPlanListRequestParams } from './types/order-plan-list.request.type';
import { OrderPlan_Service } from './types/order-plan-service.type';
import { OrderPlan_Thing } from './types/order-plan-thing.type';

const ORDER_PLAN_LIST_THING_SERVICE_NAME = 'getOrderPlanSttusListThng';
const ORDER_PLAN_LIST_CONSTRUCTION_SERVICE_NAME = 'getOrderPlanSttusListCnstwk';
const ORDER_PLAN_LIST_SERVICE_SERVICE_NAME = 'getOrderPlanSttusListServc';
const ORDER_PLAN_LIST_FOREIGN_SERVICE_NAME = 'getOrderPlanSttusListFrgcpt';
const ORDER_PLAN_OPINION_THING_SERVICE_NAME =
  'getPublicPrcureThngOpinionInfoThng';

/**
 * 조달청_나라장터 발주계획현황서비스
 * @see https://www.data.go.kr/data/15129394/openapi.do
 * @author 최강훈 <ganghun@lepisode.team>
 */
@Injectable()
export class OpenAPIOrderPlanService {
  private readonly logger = new Logger(OpenAPIOrderPlanService.name);

  private readonly endpoint =
    'http://apis.data.go.kr/1230000/ao/OrderPlanSttusService';

  constructor(
    @Inject(OPENAPI_MODULE_OPTIONS)
    private readonly options: OpenAPIModuleOptions,
    private readonly http: HttpService,
  ) {}

  /**
   * 발주계획현황에 대한 물품조회
   * @serviceName getOrderPlanSttusListThng
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getOrderPlanListThing(params: OrderPlanListRequestParams) {
    const url = `${this.endpoint}/${ORDER_PLAN_LIST_THING_SERVICE_NAME}`;

    console.debug('Requesting Thing Order Plans with params:', params);

    const res = await this.http.axiosRef.get<OpenAPIResponse<OrderPlan_Thing>>(
      url,
      {
        params: {
          serviceKey: this.options.serviceKey,
          type: 'json',
          ...params,
        },
      },
    );

    if (res.data.response.header.resultCode !== '00') {
      throw new Error('발주계획현황에 대한 물품 조회중 오류가 발생했습니다.');
    }

    return res.data;
  }

  /**
   * 발주계획현황에 대한 공사조회
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getOrderPlanListConstruction(params: OrderPlanListRequestParams) {
    const url = `${this.endpoint}/${ORDER_PLAN_LIST_CONSTRUCTION_SERVICE_NAME}`;

    const res = await this.http.axiosRef.get(url, {
      params: {
        serviceKey: this.options.serviceKey,
        type: 'json',
        ...params,
      },
    });

    if (res.data.response.header.resultCode !== '00') {
      throw new BadGatewayException(
        '발주계획현황에 대한 공사 조회중 오류가 발생했습니다.',
      );
    }

    return res.data;
  }

  /**
   * 발주계획현황에 대한 용역조회
   * @author 최강훈 <ganghun@lepisode.team>
   */
  getOrderPlanListService(params: OrderPlanListRequestParams) {
    const url = `${this.endpoint}/${ORDER_PLAN_LIST_SERVICE_SERVICE_NAME}`;

    return this.http.axiosRef
      .get<OpenAPIResponse<OrderPlan_Service>>(url, {
        params: {
          serviceKey: this.options.serviceKey,
          type: 'json',
          ...params,
        },
      })
      .then((res) => {
        if (!res.data.response) {
          this.logger.error(res.data.response);
          throw new BadGatewayException(
            '발주계획현황에 대한 용역 조회중 오류가 발생했습니다.',
          );
        }

        if (res.data.response.header.resultCode !== '00') {
          this.logger.error(res.data.response);
          throw new BadGatewayException(
            '발주계획현황에 대한 용역 조회중 오류가 발생했습니다.',
          );
        }
        return res.data;
      });
  }

  /**
   * 발주계획현황에 대한 외자조회
   * @author 최강훈 <ganghun@lepisode.team>
   */
  getOrderPlanListForeign(params: OrderPlanListRequestParams) {
    const url = `${this.endpoint}/${ORDER_PLAN_LIST_FOREIGN_SERVICE_NAME}`;

    return this.http.axiosRef
      .get<OpenAPIResponse<OrderPlan_Foreign>>(url, {
        params: {
          serviceKey: this.options.serviceKey,
          type: 'json',
          ...params,
        },
      })
      .then((res) => {
        if (res.data.response.header.resultCode !== '00') {
          throw new BadGatewayException(
            '발주계획현황에 대한 외자 조회중 오류가 발생했습니다.',
          );
        }
        return res.data;
      });
  }

  getOrderPlanThingOpinion() {
    const url = `${this.endpoint}/getOrderPlanSttusListThngOpnion`;
  }
}
