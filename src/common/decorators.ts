const cache: Record<string, any> = {};

export const Cached = () => {
  return (target: Object, key: string, descriptor: PropertyDescriptor) => {
    const cacheKey = `${target.constructor.name}.${key}`;

    return {
      get() {
        if (!(cacheKey in cache)) {
          cache[cacheKey] = descriptor.get!.apply(this);
        }

        return cache[cacheKey];
      },
    };
  };
};
