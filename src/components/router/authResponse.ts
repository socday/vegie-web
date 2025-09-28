export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phoneNumbers: string;
    createAt: string;
    updateAt: string;
    accessToken: string;
    refreshToken: string;
    roles: string[];
  };
  message: string;
  exception: string | null;
}