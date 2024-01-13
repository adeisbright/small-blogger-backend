export interface Success {
  customerName: string;
  done: boolean;
  results: Array<formData>;
}

export interface formData {
  name: string;
  value: any;
}

export interface Error {
  errors: any;
  status: string;
  message: string;
  responseMessage: string;
}
