// const getListProduct = async (endpoint: string) => {
//   return axiosRequest(endpoint, "GET");
// };

// const createProduct = async <T>(endpoint: string, body: any) => {
//   try {
//     const response = await axiosRequest<T>(endpoint, "POST", body);
//     console.log("Product created successfully", "Success");
//     return response;
//   } catch (error) {
//     console.log("Product creation failed", "Error");
//     throw error;
//   }
// };

// const updateProduct = async <T>(
//   endpoint: string,
//   body: any
// ): Promise<ApiResponse<T>> => {
//   return axiosRequest<T>(endpoint, "PUT", body);
// };

// const deleteProduct = async <T>(
//   endpoint: string,
//   body: any
// ): Promise<ApiResponse<T>> => {
//   return axiosRequest<T>(endpoint, "DELETE", body);
// };

// export const productApi = {
//   getListProduct,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   loading,
//   error,
// };
