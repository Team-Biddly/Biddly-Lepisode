export const groupBy = (array: any[], iteratee: any) => {
  const result: Record<string, Set<any>> = {};
  array.forEach((item) => {
    let key: string | undefined;

    // 1. iteratee가 함수일 경우
    if (typeof iteratee === 'function') {
      key = iteratee(item);

      // 2. iteratee가 문자열일 경우
    } else if (typeof iteratee === 'string') {
      key = item[iteratee];

      // 3. iteratee가 배열 경로일 경우
    } else if (Array.isArray(iteratee)) {
      key = iteratee.reduce(
        (acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined),
        item,
      );
    }

    if (key) {
      if (!result[key]) {
        result[key] = new Set();
      }
      result[key].add(item); // 전체 객체 추가
    }
  });

  return Object.entries(result).map(([group, options]) => ({
    group,
    options: Array.from(options),
  }));
};

export const groupByArray = (
  data: any[],
  arrayProperty: string,
  keyProperty: string,
) => {
  const result: Record<string, Set<any>> = {};

  data.forEach((item) => {
    const arrayField = item[arrayProperty];

    if (Array.isArray(arrayField)) {
      arrayField.forEach((element) => {
        const key = element[keyProperty];

        if (key) {
          if (!result[key]) {
            result[key] = new Set();
          }
          result[key].add(item); // 전체 객체 추가
        }
      });
    }
  });

  return Object.entries(result).map(([group, options]) => ({
    group,
    options: Array.from(options),
  }));
};
