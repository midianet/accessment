
const parseUrl =  (baseUrl :string, params:string[]): string => {
  let url = baseUrl;
  let concater = '?';
  params.forEach(param => {
    url = `${url}${concater}${param}`;
    concater='&';
  });
  return url;
};

export const UrlHelper = {
  parseUrl
};