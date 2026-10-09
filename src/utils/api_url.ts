// Define the base URL of your API
const BASE_URL = "http://localhost:9000";

// List of API endpoints
const API_ENDPOINTS = {
  ApiUrl: BASE_URL,
  bearerToken: `Bearer ${process.env.API_TOKEN}`,
  //----------------------------------
  //Users
  getToken: "/api/get-token",
  getUsers: "/admin/users",
  createUser: "/api/create-user",
  getUserById: (id) => `${BASE_URL}/users/${id}`,
  //----------------------------------
  //Products
  getProducts: "/admin/products",
  createProduct: "/admin/products",
  createMultipleProducts: "/api/create-products",

  //----------------------------------
  //Orders
  getOrders: "/admin/orders",
};

// Export the endpoints
export default API_ENDPOINTS;
