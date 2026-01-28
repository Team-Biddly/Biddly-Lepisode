const isCamelCase = (str) => {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
};

const isPascalCase = (str) => {
  return /^[A-Z][a-zA-Z]*$/.test(str);
};

const isSnakeCase = (str) => {
  return /^[a-z]+(_[a-z]+)*$/.test(str);
};

const isKebabCase = (str) => {
  return /^[a-z]+(-[a-z]+)*$/.test(str);
};

const camelToPascal = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const camelToKebab = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

const pascalToCamel = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const pascalToSnake = (str) => {
  return str.replace(
    /[A-Z]/g,
    (letter, index) => (index ? "_" : "") + letter.toLowerCase()
  );
};

const pascalToKebab = (str) => {
  return str.replace(
    /[A-Z]/g,
    (letter, index) => (index ? "-" : "") + letter.toLowerCase()
  );
};

const snakeToCamel = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const snakeToPascal = (str) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

const snakeToKebab = (str) => {
  return str.replace(/_/g, "-");
};

const kebabToCamel = (str) => {
  return str.replace(/-./g, (x) => x.toUpperCase()[1]);
};

const kebabToPascal = (str) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

const kebabToSnake = (str) => {
  return str.replace(/-/g, "_");
};

const getAllCaseByName = (name) => {
  let camel, pascal, snake, kebab;

  if (isCamelCase(name)) {
    camel = name;
    pascal = camelToPascal(name);
    snake = camelToSnake(name);
    kebab = camelToKebab(name);
  } else if (isPascalCase(name)) {
    pascal = name;
    camel = pascalToCamel(name);
    snake = pascalToSnake(name);
    kebab = pascalToKebab(name);
  } else if (isSnakeCase(name)) {
    snake = name;
    camel = snakeToCamel(name);
    pascal = snakeToPascal(name);
    kebab = snakeToKebab(name);
  } else if (isKebabCase(name)) {
    kebab = name;
    camel = kebabToCamel(name);
    pascal = kebabToPascal(name);
    snake = kebabToSnake(name);
  }

  return { camel, pascal, snake, kebab };
};

module.exports = {
  isCamelCase,
  isPascalCase,
  isSnakeCase,
  isKebabCase,
  getAllCaseByName,
};
