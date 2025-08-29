import { buildUrlWithParams } from './build-url-with-params.helper';
import { BuildUrlWithParamsProps, ParamUrl } from './build-url-with-params.types';

describe('buildUrlWithParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build URL with single parameter', () => {
    const props: BuildUrlWithParamsProps = {
      baseUrl: 'https://example.com/api',
      paramsArray: [{ name: 'id', value: '123' }],
    };

    const result = buildUrlWithParams(props);

    expect(result).toBe('https://example.com/api?id=123');
  });

  it('should build URL with multiple parameters', () => {
    const params: ParamUrl[] = [
      { name: 'page', value: '1' },
      { name: 'limit', value: '10' },
      { name: 'sort', value: 'name' },
    ];

    const props: BuildUrlWithParamsProps = {
      baseUrl: 'https://api.example.com/users',
      paramsArray: params,
    };

    const result = buildUrlWithParams(props);

    expect(result).toBe('https://api.example.com/users?page=1&limit=10&sort=name');
  });

  it('should build URL with empty parameters array', () => {
    const props: BuildUrlWithParamsProps = {
      baseUrl: 'https://example.com',
      paramsArray: [],
    };

    const result = buildUrlWithParams(props);

    expect(result).toBe('https://example.com/');
  });

  it('should handle URL with existing query parameters', () => {
    const props: BuildUrlWithParamsProps = {
      baseUrl: 'https://example.com/search?existing=value',
      paramsArray: [{ name: 'new', value: 'param' }],
    };

    const result = buildUrlWithParams(props);

    expect(result).toBe('https://example.com/search?new=param');
  });

  it('should handle special characters in parameter values', () => {
    const props: BuildUrlWithParamsProps = {
      baseUrl: 'https://example.com/api',
      paramsArray: [
        { name: 'query', value: 'hello world' },
        { name: 'filter', value: 'name=John&age=25' },
      ],
    };

    const result = buildUrlWithParams(props);

    expect(result).toBe('https://example.com/api?query=hello+world&filter=name%3DJohn%26age%3D25');
  });

  it('should handle duplicate parameter names', () => {
    const props: BuildUrlWithParamsProps = {
      baseUrl: 'https://example.com/api',
      paramsArray: [
        { name: 'tag', value: 'javascript' },
        { name: 'tag', value: 'react' },
        { name: 'tag', value: 'typescript' },
      ],
    };

    const result = buildUrlWithParams(props);

    expect(result).toBe('https://example.com/api?tag=javascript&tag=react&tag=typescript');
  });

  it('should handle localhost URLs', () => {
    const props: BuildUrlWithParamsProps = {
      baseUrl: 'http://localhost:3000/api/v1/data',
      paramsArray: [
        { name: 'debug', value: 'true' },
        { name: 'env', value: 'development' },
      ],
    };

    const result = buildUrlWithParams(props);

    expect(result).toBe('http://localhost:3000/api/v1/data?debug=true&env=development');
  });
});
