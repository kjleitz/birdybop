// String, Number, Boolean, Array, Object, Date, Function, Symbol

import { classChecker } from "@/lib/utils";



export type Validate = (value: any) => boolean;
export type Validator = (...args: any[]) => (value: any) => boolean;

export const isA = classChecker;
export const isAn = isA;

export function not(validate: Validate): Validate {
  return value => !validate(value);
}

export function or(...validateFunctions: Validate[]): Validate {
  return value => validateFunctions.some(validate => validate(value));
}

export function and(...validateFunctions: Validate[]): Validate {
  return value => validateFunctions.every(validate => validate(value));
}
