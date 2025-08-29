export type BuildUrlWithParamsProps = {
  baseUrl: string;
  paramsArray: ParamUrl[];
};

export type ParamUrl = {
  name: string;
  value: string;
};
