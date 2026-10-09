// import axios, {AxiosRequestConfig, Method} from "axios";

// // Constants
// const BASE_URL = process.env.API_MEDUSA_URL;

// // Types
// interface ApiResponse<T = any> {
//   data: T;
//   status: number;
//   statusText: string;
// }

// let loading = false;
// let error: Error | null = null;
// let token: string | null = null;

// const setLoading = (value: boolean) => {
//   loading = value;
// };

// const setError = (value: Error | null) => {
//   error = value;
// };

// const setToken = (value: string | null) => {
//   token = value;
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

// // Auth functions
// const login = async <T>(
//   endpoint: string,
//   body: any
// ): Promise<ApiResponse<T>> => {
//   const response = (await axiosRequest<T>(endpoint, "POST", body)) as any;
//   if (response.data.token) {
//     setToken(response.data.token);
//   }
//   return response;
// };

// const getToken = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
//   const response = (await axiosRequest<T>(endpoint, "GET")) as any;
//   if (response.data.access_token) {
//     setToken(response.data.access_token);
//   }
//   return response;
// };

// export const authApi = {
//   login,
//   getToken,
//   loading,
//   error,
//   token,
// };

// export default authApi;
