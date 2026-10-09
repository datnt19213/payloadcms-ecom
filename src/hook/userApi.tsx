import { useState } from "react";
import API_ENDPOINTS from "../utils/api_url";

const BASE_URL = API_ENDPOINTS.ApiUrl;
const TOKEN = API_ENDPOINTS.bearerToken;

const userApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getListUser = async (endpoint, method = "GET", body = null) => {
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
  const createUser = async (endpoint, method = "POST", body = null) => {
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
  const updateUser = async (endpoint, method = "POST", body = null) => {
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
  const deleteUser = async (endpoint, method = "POST", body = null) => {
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
    getListUser,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default userApi;
