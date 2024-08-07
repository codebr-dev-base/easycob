export const chunks = (items: Array<any>, max: number) => {
  return items.reduce((accumulator, item, index) => {
    const grupo = Math.floor(index / max);
    accumulator[grupo] = [...(accumulator[grupo] || []), item];
    return accumulator;
  }, []);
};

export const toSeparate = chunks;
