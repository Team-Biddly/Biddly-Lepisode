import dayjs from 'dayjs';
import { OpenAPIPreStandardOpinion } from './types/pre-standard-opinion.type';

export class PreStandardOpinionEntity {
  constructor(private readonly data: OpenAPIPreStandardOpinion) {}

  toJSON() {
    return {
      사전규격등록번호: this.data.bfSpecRgstNo,
      참조번호: this.data.refNo,
      의견번호: this.data.opninNo,
      답변번호: this.data.rplyNo,
      의견제목: this.data.opninTitl,
      작성업체명: this.data.mkngCorpNm,
      작성자명: this.data.mkrNm,
      입력일시: dayjs(this.data.inptDt).toDate(),
      작성자전화번호: this.data.mkrTel,
      작성자이메일: this.data.mkrEmail,
      규격의견서파일URL: [
        this.data.specDocOpninFileUrl1,
        this.data.specDocOpninFileUrl2,
        this.data.specDocOpninFileUrl3,
        this.data.specDocOpninFileUrl4,
        this.data.specDocOpninFileUrl5,
      ]
        .filter((i) => i !== '')
        .filter((i) => i !== '추후제공'),
      의견내용: this.data.opninCntnts,
    };
  }
}
