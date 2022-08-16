// SECTION: Basic types
export type Num = _ReactiveType<number>;
export type Bool = _ReactiveType<boolean>;
export type Text = _ReactiveType<string>;
type _ReactiveType<T> =
  | {
      value: T;
      onChange: Event;
    }
  | T;

// SECTION: App Data
export type AppData<T> = {
  [Key in keyof T]: _ReactiveType<T[Key]>;
};
export function appData<T>(params: T): AppData<T> {
  return params as any;
}
