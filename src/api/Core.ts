import axios from "axios";
import {Enum} from "../common/data";

const BASE_URL = Enum.MEDUSA_ENDPOINT;
const ORDER_CUSTOMER_DETAIL_URL = Enum.ORDER_SHIPPING_DETAIL;

const APIGetOrderNoAuth = async (shippingMethodDataCode: string) => {
  try {
    const response = await axios.get(
      `${ORDER_CUSTOMER_DETAIL_URL}${shippingMethodDataCode}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response) {
      return {success: false, message: "No response received", data: null};
    }

    if (!response.data) {
      return {
        success: false,
        message: "Response data is undefined",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return {
      success: false,
      message: `Error fetching data: ${error.message}`,
      data: null,
    };
  }
};
const APIGet = async (endpoint: string, userToken: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response) {
      return {success: false, message: "No response received", data: null};
    }

    if (!response.data) {
      return {
        success: false,
        message: "Response data is undefined",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return {
      success: false,
      message: `Error fetching data: ${error.message}`,
      data: null,
    };
  }
};
const APIPost = async (
  endpoint: string,
  data: any = null,
  userToken: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${endpoint}`,
      data ? JSON.stringify(data) : null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    if (!response) {
      return {success: false, message: "No response received", data: null};
    }

    if (!response.data) {
      return {
        success: false,
        message: "Response data is undefined",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return {
      success: false,
      message: `Error fetching data: ${error.message}`,
      data: null,
    };
  }
};
const APIPostNoData = async (endpoint: string, userToken: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${endpoint}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    if (!response) {
      return {success: false, message: "No response received", data: null};
    }

    if (!response.data) {
      return {
        success: false,
        message: "Response data is undefined",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return {
      success: false,
      message: `Error fetching data: ${error.message}`,
      data: null,
    };
  }
};

const APIPut = async (
  endpoint: string,
  data: any = null,
  userToken: string
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${endpoint}`,
      data ? JSON.stringify(data) : null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    if (!response) {
      return {success: false, message: "No response received", data: null};
    }

    if (!response.data) {
      return {
        success: false,
        message: "Response data is undefined",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return {
      success: false,
      message: `Error fetching data: ${error.message}`,
      data: null,
    };
  }
};
const APIPatch = async (
  endpoint: string,
  data: any = null,
  userToken: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${endpoint}`,
      data ? JSON.stringify(data) : null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    if (!response) {
      return {success: false, message: "No response received", data: null};
    }

    if (!response.data) {
      return {
        success: false,
        message: "Response data is undefined",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return {
      success: false,
      message: `Error fetching data: ${error.message}`,
      data: null,
    };
  }
};
const APIDelete = async (
  endpoint: string,
  itemId: string,
  userToken: string
) => {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}/${itemId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response) {
      return {success: false, message: "No response received", data: null};
    }

    if (!response.data) {
      return {
        success: false,
        message: "Response data is undefined",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return {
      success: false,
      message: `Error fetching data: ${error.message}`,
      data: null,
    };
  }
};

export {
  APIGet,
  APIPost,
  APIPut,
  APIPatch,
  APIDelete,
  APIGetOrderNoAuth,
  APIPostNoData,
};
