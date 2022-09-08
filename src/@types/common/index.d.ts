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
