// import React from "react";
// import * as CryptoJS from "crypto-js";

// const encryptData = (data: string, secretKey: string): string => {
//   return CryptoJS.AES.encrypt(data, secretKey).toString();
// };

// const decryptData = (encryptedData: string, secretKey: string): string => {
//   const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };

// export {encryptData, decryptData};

// import crypto from "crypto";

// const ALGORITHM = "aes-256-cbc";
// const ENCODING = "hex";
// const IV_LENGTH = 16;

// const encryptData = (data: string, key: string) => {
//   const iv = crypto.randomBytes(IV_LENGTH);
//   const cipher = crypto.createCipheriv(ALGORITHM, new Buffer(key), iv);
//   return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(
//     ENCODING
//   );
// };

// const decryptData = (data: string, key: string) => {
//   const binaryData = new Buffer(data, ENCODING);
//   const iv = binaryData.slice(-IV_LENGTH);
//   const encryptedData = binaryData.slice(0, binaryData.length - IV_LENGTH);
//   const decipher = crypto.createDecipheriv(ALGORITHM, new Buffer(key), iv);

//   return Buffer.concat([
//     decipher.update(encryptedData),
//     decipher.final(),
//   ]).toString();
// };

// export {encryptData, decryptData};

const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12; // AES-GCM recommended IV length

const encode = (data: Uint8Array): string => Buffer.from(data).toString("hex");
const decode = (data: string): Uint8Array =>
  new Uint8Array(Buffer.from(data, "hex"));

const generateKey = async (key: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyData = enc.encode(key).slice(0, 32); // Ensure key length is 256 bits
  return crypto.subtle.importKey("raw", keyData, ALGORITHM, false, [
    "encrypt",
    "decrypt",
  ]);
};

const encryptData = async (data: string, key: string): Promise<string> => {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const cryptoKey = await generateKey(key);
  const enc = new TextEncoder();
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv,
    },
    cryptoKey,
    enc.encode(data)
  );
  const combinedData = new Uint8Array(encryptedData.byteLength + iv.byteLength);
  combinedData.set(new Uint8Array(encryptedData), 0);
  combinedData.set(iv, encryptedData.byteLength);
  return encode(combinedData);
};

const decryptData = async (data: string, key: string): Promise<string> => {
  const binaryData = decode(data);
  const iv = binaryData.slice(-IV_LENGTH);
  const encryptedData = binaryData.slice(0, binaryData.length - IV_LENGTH);
  const cryptoKey = await generateKey(key);
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv,
    },
    cryptoKey,
    encryptedData
  );
  const dec = new TextDecoder();
  return dec.decode(decryptedData);
};

export {encryptData, decryptData};
