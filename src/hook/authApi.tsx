import { useState } from "react";
import API_ENDPOINTS from "../utils/api_url";

const BASE_URL = API_ENDPOINTS.ApiUrl;

const authApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (endpoint, method = "POST", body = null) => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const url = `${BASE_URL}${endpoint}`;
      const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
      }

      setLoading(false);
      return data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw new Error(`Error fetching data: ${error.message}`);
    }
  };
  const getToken = async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const url = `${BASE_URL}${endpoint}`;
      const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (data.access_token) {
        setToken(data.access_token);
      }
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
    token,
    login,
    getToken,
  };
};

export default authApi;
