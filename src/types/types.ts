export interface LoginUserResponse {
  _id: string;
  token: string;
  email: string;
  message?: string;
}

export interface ErrorMessage {
  message: string;
}