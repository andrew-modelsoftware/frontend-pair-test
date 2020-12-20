export type HttpClient = (
    url: RequestInfo, 
    options?: RequestInit | undefined
  ) => Promise<Response> 

export const getHttpClient: () => HttpClient = () => fetch