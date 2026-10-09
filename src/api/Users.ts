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

// // Helper function
// const axiosRequest = async <T>(
//   endpoint: string,
//   method: Method,
//   body: any = null
// ): Promise<ApiResponse<T>> => {
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
//     return response;
//   } catch (error) {
//     throw new Error(`Error fetching data: ${(error as Error).message}`);
//   }
// };

// // CRUD functions
// export const getListUser = async <T>(
//   endpoint: string
// ): Promise<ApiResponse<T>> => {
//   return axiosRequest<T>(endpoint, "GET");
// };

// export const createUser = async <T>(
//   endpoint: string,
//   body: any
// ): Promise<ApiResponse<T>> => {
//   return axiosRequest<T>(endpoint, "POST", body);
// };

// export const updateUser = async <T>(
//   endpoint: string,
//   body: any
// ): Promise<ApiResponse<T>> => {
//   return axiosRequest<T>(endpoint, "PUT", body);
// };

// export const deleteUser = async <T>(
//   endpoint: string,
//   body: any
// ): Promise<ApiResponse<T>> => {
//   return axiosRequest<T>(endpoint, "DELETE", body);
// };
