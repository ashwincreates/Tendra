export interface Response<T> {
  data?: T;
  error?: string;
  message: string;
  success: boolean;
}

export const successResponse = <T>(
  data?: T,
  message = "Success",
): Response<T> => ({
  data,
  error: undefined,
  message: message,
  success: true,
});

export const errorResponse = (error: string): Response<undefined> => ({
  data: undefined,
  error,
  message: "Error",
  success: false,
});
