import * as CryptoJS from "crypto-js";
import CONSTANTS from "../../utils/constants";

let Key = CONSTANTS.KEY;

// function to encrypt and decrypt a string using crypto

const encryptData = (value, type) => {
  let data;
// console.log("testttttt",value,type);
  if (type === "enc") {
    data = value;

    let cryptedData = CryptoJS.AES.encrypt(data, Key).toString();
    // console.log("cryptedData",cryptedData);

    return cryptedData.split("/").join("::");
  }

  if (type === "dec") {
    data = value.split("::").join("/");

    let bytes = CryptoJS.AES.decrypt(data, Key);

    return bytes.toString(CryptoJS.enc.Utf8);
  }
};

export default encryptData;
