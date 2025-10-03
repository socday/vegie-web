export interface LoginRequest {
  emailOrPhoneNumber: string;
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

export interface RegisterRequest {
  email:string;
  password:string;
  passwordConfirm:string ;
  fullName: string;
  phoneNumber: string;
  address:string;
}

export interface RegisterResponse {
  isSuccess: true;
  data: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    address: string
  };
  message: string;
  exception: string| null;
}