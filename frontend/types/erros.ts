export type ErrosFieldT = {
  field: string;
  message: string;
  rule: string;
  double?: boolean;
  payload?: object;
};

export type ErrosT = {
  data: {
    messages: {
      errors: [];
    };
  };
};
