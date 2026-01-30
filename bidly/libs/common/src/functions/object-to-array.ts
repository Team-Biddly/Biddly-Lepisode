/**
 * @name fnObjectToArray
 * @description 객체를 배열로 변환합니다.
 * @param {T} obj
 * @returns {{ label: T; value: string }[]}
 */
export function fnObjectToArray<T>(obj: {
  [key: string]: T;
}): { label: T; value: string }[] {
  return Object.entries(obj).map(([key, value]) => ({
    label: value,
    value: key,
  }));
}
