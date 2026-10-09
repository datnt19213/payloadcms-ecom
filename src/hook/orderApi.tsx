import { useState } from "react";
import API_ENDPOINTS from "../utils/api_url";

const BASE_URL = API_ENDPOINTS.ApiUrl;
const TOKEN = API_ENDPOINTS.bearerToken;

const orderApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getListOrder = async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: API_ENDPOINTS.bearerToken,
      };

      const url = `${BASE_URL}${endpoint}`;
      const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      };

      const response = await fetch(url, options);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw new Error(`Error fetching data: ${error.message}`);
    }
  };

  return {
    loading,
    error,
    getListOrder,
  };
};

export default orderApi;
