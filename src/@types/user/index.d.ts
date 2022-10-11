export interface ITmpSocialUser {
  socialType: string;
  socialID: number;
  accessToken: string;
  refreshToken: string;
}

export interface ISocialLoginBody {
  email: string;
  sub: number;
}
