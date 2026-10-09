// import axios, {AxiosRequestConfig, Method} from "axios";

// // Constants
// const BASE_URL = process.env.API_MEDUSA_URL;
// const API_ENDPOINTS = {
//   bearerToken: process.env.API_TOKEN,
// };

// // Types
// interface ApiResponse<T = any> {
//   data: T;
//   status: number;
//   statusText: string;
// }

// let loading = false;
// let error: Error | null = null;

// const setLoading = (value: boolean) => {
//   loading = value;
// };

// const setError = (value: Error | null) => {
//   error = value;
// };

// // Helper function
// const axiosRequest = async <T>(
//   endpoint: string,
//   method: Method,
//   body: any = null
// ): Promise<ApiResponse<T>> => {
//   setLoading(true);
//   try {
//     const config: AxiosRequestConfig = {
//       url: `${BASE_URL}${endpoint}`,
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${API_ENDPOINTS.bearerToken}`,
//       },
//       data: body ? JSON.stringify(body) : null,
//     };

//     const response = await axios(config);
//     setLoading(false);
//     return response;
//   } catch (error) {
//     setError(error as Error);
//     setLoading(false);
//     throw new Error(`Error fetching data: ${(error as Error).message}`);
//   }
// };

// // CRUD functions
// const getListOrder = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
//   return axiosRequest<T>(endpoint, "GET");
// };

// export const orderApi = {
//   getListOrder,
//   loading,
//   error,
// };
