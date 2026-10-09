import React from "react";
import {Common} from "../../common/data";
interface Token {
  token?: string;
}
export const CheckToken = (): Token => {
  const tokenStr = localStorage.getItem(Common.token);

  if (!tokenStr) {
    return {token: null};
  } else {
    try {
      const token = tokenStr;
      return {token: token};
    } catch (error) {
      return {token: null};
    }
  }
};

export const CreateLocalStorage = (key: string, value: string): boolean => {
  try {
    if (key && value) {
      localStorage.setItem(key, value);
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
  }
};
export const GetLocalStorage = (key: string): string => {
  try {
    if (key) {
      let item = localStorage.getItem(key);
      return item;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
};
export const RemoveOneLocalStorage = (key: string): boolean => {
  try {
    if (key) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
  }
};
export const UpdateLocalStorage = (key: string, value: string): boolean => {
  try {
    if (key && value) {
      localStorage.setItem(key, value);
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
  }
};
