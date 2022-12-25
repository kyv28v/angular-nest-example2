export interface Message {
  message: string;
}

export interface AuthToken {
  userId?: number;
  accessToken?: string;
  refreshToken?: string;
  message: string;
}

export interface QueryResult {
  rows?: any;
  message: string;
}
