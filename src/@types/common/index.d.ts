/**
 *@description : api request custom type
 */
export type TRequest = {
  user:
    | {
        userId: number;
      }
    | undefined;
  session:
    | {
        filename: string;
      }
    | undefined;
};

export type TAccessToken = {
  sub?: number;
  email?: string;
  iat?: number;
  exp?: number;
};
