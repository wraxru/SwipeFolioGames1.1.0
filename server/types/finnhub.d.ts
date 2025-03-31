declare module 'finnhub' {
  export interface ApiClientInstance {
    authentications: {
      'api_key': {
        apiKey: string;
      };
    };
  }

  export const ApiClient: {
    instance: ApiClientInstance;
  };

  interface ApiCallback<T> {
    (error: any, data: T, response: any): void;
  }

  export class DefaultApi {
    constructor();
    
    quote(symbol: string, callback: ApiCallback<any>): void;
    companyProfile2(params: { symbol: string }, callback: ApiCallback<any>): void;
    companyBasicFinancials(symbol: string, metric: string, callback: ApiCallback<any>): void;
    priceTarget(symbol: string, callback: ApiCallback<any>): void;
    recommendationTrends(symbol: string, callback: ApiCallback<any>): void;
  }
}