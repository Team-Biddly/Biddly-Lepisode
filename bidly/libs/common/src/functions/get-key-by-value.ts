/**
 * @name fnGetKeyByValue
 * @description 객체에서 값으로 키를 찾아 반환합니다.
 * @param {T} object
 * @param {K} value
 * @returns {K}
 */
export function fnGetKeyByValue<T extends object, K extends keyof T>(
  object: T,
  value: T[K],
): K {
  const key = Object.keys(object).find(
    (key) => object[key as K] === value,
  ) as K;

  if (key !== value && typeof key !== 'undefined') {
    return key;
  }

  return value as any;
}
