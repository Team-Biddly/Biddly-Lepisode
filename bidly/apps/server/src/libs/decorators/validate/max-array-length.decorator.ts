import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function MaxArrayLength(
  max: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "maxArrayLength",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [max],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [max] = args.constraints;
          return Array.isArray(value) && value.length <= max;
        },
        defaultMessage(args: ValidationArguments) {
          const [max] = args.constraints;
          return `Array length should not be greater than ${max}`;
        },
      },
    });
  };
}
