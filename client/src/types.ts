export enum ResponseState {
  Pending = "pending",
  Success = "success",
  Error = "error",
}

export type Message = {
  id: string;
  userId: string;
  message: string;
  responseState: ResponseState;
  response: string;
};
