export function fnContactTransform(value?: string): string {
    if (!value) return '-';

    // 숫자만 남기기
    const digits = value.replace(/\D/g, '');

    // 휴대폰 번호: 01012345678
    if (/^01[016789]\d{7,8}$/.test(digits)) {
        return digits.replace(/(^01[016789])(\d{3,4})(\d{4})$/, '$1-$2-$3');
    }

    // 서울 지역번호 (02) 전화번호: 0212345678
    if (/^02\d{7,8}$/.test(digits)) {
        return digits.replace(/^(02)(\d{3,4})(\d{4})$/, '$1-$2-$3');
    }

    // 그 외 지역번호 (03x, 04x, 05x 등): 0312345678
    if (/^0\d{2}\d{7,8}$/.test(digits)) {
        return digits.replace(/^(0\d{2})(\d{3,4})(\d{4})$/, '$1-$2-$3');
    }

    // 그 외 포맷은 그대로 반환
    return value;
}
