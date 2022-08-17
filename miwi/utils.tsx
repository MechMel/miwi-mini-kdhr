export function readonlyObj<T>(obj: T): Readonly<T> {
  return obj;
}

export function exists(obj: any) {
  return obj !== undefined && obj !== null;
}

export function print(message: any) {
  console.log(message);
}

export function isString(possibleString: any): possibleString is string {
  return typeof possibleString === `string`;
}
