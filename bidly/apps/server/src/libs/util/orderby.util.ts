/**
 * orderBy, align 값을 받아서 정렬 객체를 생성 합니다.
 * @param orderBy
 * @param align
 * @returns
 * @author 박지훈 <jihun@lepisode.team>
 */
export const getOrderBy = (orderBy: string, align: string) => {
  if (!orderBy.includes('.')) {
    return {
      [orderBy || 'createdAt']: align || 'desc',
    };
  }

  const fields = orderBy.split('.');
  return createNestedOrderBy(fields, align);
};

/**
 * 중첩된 정렬 객체를 생성 합니다.
 * @param fields ['user', 'name']
 * @param align  'desc' | 'asc
 * @returns
 * @author 박지훈 <jihun@lepisode.team>
 */
const createNestedOrderBy = (fields: string[], align: string) => {
  if (fields.length === 1) {
    return {
      [fields[0]]: align,
    };
  }

  const field = fields.shift();
  return {
    [field]: createNestedOrderBy(fields, align),
  };
};
