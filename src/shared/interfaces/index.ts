export interface ObjectLiteral {
    [key: string]: any;
}

export interface IResponseInterface {
  status?: string;
  data: Record<string, any> | any;
  cache?: Record<string, any>;
  extraData?: Record<string, any>;
}
