export interface ITmpSocialUser {
  socialType: string;
  socialID: string;
  accessToken: string;
  refreshToken: string;
}

export interface ISocialLoginBody {
  email: string;
  sub: number;
}
