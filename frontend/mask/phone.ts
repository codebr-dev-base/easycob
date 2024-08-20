export const maskPhone = (val: string) => {
  if (val.length == 8) {
    return "####-####";
  }
  if (val.length == 9) {
    return "#####-####";
  }
  if (val.length == 10) {
    return "(##) ####-####";
  }

  return "(##) #####-####";
};
