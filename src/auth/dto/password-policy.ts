import { Matches, MinLength } from 'class-validator';

export function StrongPassword() {
  return function (target: object, propertyKey: string) {
    MinLength(10, { message: 'A senha deve ter no minimo 10 caracteres.' })(target, propertyKey);
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message: 'A senha deve conter letra minuscula, letra maiuscula e numero.',
    })(target, propertyKey);
  };
}
