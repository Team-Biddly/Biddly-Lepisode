/**
 * @name generateCodeEmailContent
 * @returns { title: string; emailTemplate: string }
 */
export function generateCodeEmailContent({
  code,
  emailTemplate,
}: {
  code: string;
  emailTemplate: string;
}): {
  title: string;
  emailTemplate: string;
} {
  let title = `[${process.env.SERVICE_NAME}]`;
  const emailTitle = '인증코드';
  let TEXT1 = '';
  let TEXT2 = '';
  let TEXT3 = '';
  let TEXT4 = '';
  let TEXT5 = '';
  let TEXT6 = '';
  let COMPANY_NAME = '비들리';
  let ADDRESS = '';
  let BUSINESS_NUMBER = '';
  let CONTACT = '';
  let CEO = '';

  title += ' 이메일 인증 코드';
  TEXT1 = '인증번호는';
  TEXT2 = '입니다.';
  TEXT3 = '해당 인증번호를 입력해주세요.';
  TEXT4 = '본 메일은 발신전용으로 고객사명 고객님께 알려드리는 안내메일입니다.';
  TEXT5 = '문의사항은 홈페이지 또는 고객센터를 이용하시기 바랍니다.';
  TEXT6 = '상호명';
  COMPANY_NAME = '비들리';
  ADDRESS = '주소: 비들리 주소';
  BUSINESS_NUMBER = '사업자 등록번호: 123-123-1234';
  CONTACT = '대표전화: 02-1234-1234';
  CEO = '대표: 비들리 대표';

  emailTemplate = emailTemplate.replace('{{ code }}', code);
  emailTemplate = emailTemplate.replace(/\[\{\{ TITLE \}\}\]/g, emailTitle);
  emailTemplate = emailTemplate.replace(/\[\{\{ TEXT1 \}\}\]/g, TEXT1);
  emailTemplate = emailTemplate.replace(/\[\{\{ TEXT2 \}\}\]/g, TEXT2);
  emailTemplate = emailTemplate.replace(/\[\{\{ TEXT3 \}\}\]/g, TEXT3);
  emailTemplate = emailTemplate.replace(/\[\{\{ TEXT4 \}\}\]/g, TEXT4);
  emailTemplate = emailTemplate.replace(/\[\{\{ TEXT5 \}\}\]/g, TEXT5);
  emailTemplate = emailTemplate.replace(/\[\{\{ TEXT6 \}\}\]/g, TEXT6);
  emailTemplate = emailTemplate.replace(
    /\[\{\{ COMPANY_NAME \}\}\]/g,
    COMPANY_NAME,
  );
  emailTemplate = emailTemplate.replace(/\[\{\{ ADDRESS \}\}\]/g, ADDRESS);
  emailTemplate = emailTemplate.replace(
    /\[\{\{ BUSINESS_NUMBER \}\}\]/g,
    BUSINESS_NUMBER,
  );
  emailTemplate = emailTemplate.replace(/\[\{\{ CONTACT \}\}\]/g, CONTACT);
  emailTemplate = emailTemplate.replace(/\[\{\{ CEO \}\}\]/g, CEO);

  return {
    title,
    emailTemplate,
  };
}
