/*type _DefaultConstructor<T> = { (members?: Partial<T>): T };
export const defineClass = function <T>(
  memberConfigs: T
): _DefaultConstructor<T> {
  const defaultConstructor = function (constructorParams?: Partial<T>): T {
    const instance: any = {};
    for (const key in memberConfigs) {
      instance[key] =
        (constructorParams as any)?.[key] ?? (memberConfigs as any)[key];
    }
    return instance;
  };
  return defaultConstructor;
};

export const required = undefined;

export const Asset = defineClass({
  images: [] as string[],
});
const someAsset = Asset();

export type IAsset = ReturnType<typeof Asset>;*/
