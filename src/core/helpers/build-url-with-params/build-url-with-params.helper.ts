import { BuildUrlWithParamsProps } from './build-url-with-params.types';

export const buildUrlWithParams = ({ baseUrl, paramsArray }: BuildUrlWithParamsProps) => {
  const url = new URL(baseUrl);

  const params = new URLSearchParams();

  paramsArray.forEach(({ name, value }) => {
    params.append(name, value);
  });

  url.search = params.toString();

  return url.toString();
};
