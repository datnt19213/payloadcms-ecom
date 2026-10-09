import { useState } from "react";
import API_ENDPOINTS from "../utils/api_url";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const BASE_URL = API_ENDPOINTS.ApiUrl;
const TOKEN = API_ENDPOINTS.bearerToken;

const productApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getListProduct = async (endpoint, method = "GET", body = null) => {
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

  const createProduct = async (endpoint, method = "POST", body = null) => {
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
      NotificationManager.success("Product created successfully", "Success");

      return data;
    } catch (error) {
      setError(error);
      setLoading(false);
      NotificationManager.error("Product created failed", "Error");
      throw new Error(`Error fetching data: ${error.message}`);
    }
  };
  const updateProduct = async (endpoint, method = "POST", body = null) => {
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
  const deleteProduct = async (endpoint, method = "DELETE", body = null) => {
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
    getListProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default productApi;
