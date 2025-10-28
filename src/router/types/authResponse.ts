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

// types.ts
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  coupon?: string; // optional, since backend may not need it
}

export interface RegisterResponse {
  isSuccess: boolean;
  data: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    address: string;
  };
  message: string;
  exception: string | null;
}
export interface changePasswordRequest {
  
  password:string;
  passwordConfirm:string ;
}

export interface Customer {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  imgURL: string | null;
};

export interface GetCustomerResponse {
  isSuccess: boolean;
  data: Customer;
  message: string;
  exception: string | null;
}