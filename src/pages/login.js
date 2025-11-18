import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../stylesheets/loginpage.css";
import Textbox from "../components/common/entry";
import PasswordTextbox from "../components/common/PasswordTextbox";
// import Loader from '../components/common/loader';
import Button from "../components/common/button";
// import Loader from '../components/common/loader';
import CONSTANTS from "../utils/constants";
import userAjax from "../utils/userAjax";
import "react-toastify/dist/ReactToastify.css";
import handle_error from "../utils/handle";
import isEmpty from "../utils/isEmpty";
import * as CryptoJS from "crypto-js";
import encryptData from "../components/common/crypto";

toast.configure();

export default function Loginpage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [loading, setLoading] = useState(false);

  const onEmailChange = (event) => {
    setEmail(event.target.value);
    setErrorEmail(event.target.value === "");
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorPassword(event.target.value === "");
  };
  const onLogin = (event) => {
    var e = event || window.event;
    if(e.keyCode == 13){
        login()
    }
  };

  const isValid = () => {
    const emailPattern = new RegExp("[a-z A-Z 0-9._%+-]+@[ A-Za-z0-9.-]+.[a-z A-Z]{2,4}$");
    const validEmail = emailPattern.test(String(email));

    if (
      email !== "" &&
      validEmail === true &&
      password !== "" &&
      password.length >= 0
    ) {
      return true;
    }
    setErrorEmail(!validEmail);
    return false;
  };
  const login = async () => {
    if (isValid()) {
      const response = await userAjax(
        CONSTANTS.API_METHODS.POST,
        CONSTANTS.API.LOGIN,
        {},
        {},
        {
          userEmail: email,
          password,
        }
      );
      if (
        !response ||
        response.status === CONSTANTS.STATUS.UNAUTHORIZED ||
        response.status === CONSTANTS.STATUS.BAD_REQUEST ||
        response.status === CONSTANTS.STATUS.DUPLICATE_RECORD 
      ) {
        // this.setState({ invalidLogin: true, isLoading: false });
        setInvalidLogin(true);
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
       else if (response.status === CONSTANTS.STATUS.TO_MANAY_ATTEMPTS || response.status === 429) {
      toast.error(
        response.message || "Too many login attempts. Please try again after some time.",
        {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    }
 else if (response.status === CONSTANTS.STATUS.OK) {
        let abc = response?.data[0]?.permission
        let temp = encryptData(JSON.stringify(abc),"enc")
        console.log("temp123",response);
        localStorage.setItem("ENCRYPTED_DATA", temp);
        localStorage.setItem("X_ACCESS_TOKEN", response.token);
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("USER_ID", response.data[0].userId);
        localStorage.setItem("USER_NAME", response.data[0].userName);
        localStorage.setItem("CALL_CENTER_ID", response.data[0].callCenterId);
        localStorage.setItem("PASS", response.data[0].password);
        localStorage.setItem(
          "USER_ACCESS",
          response.data.length > 0
            ? JSON.stringify(response.data[0].permission)
            : ""
        );
        localStorage.setItem("IS_ADMIN", response.data[0].userType);
        toast.success(response.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          // theme: "colored"
        });
        if(response.data[0].permission.callRecords.view == true){
          props.history.push(CONSTANTS.PATHS.METADATA_RECORD);
        }else if(response.data[0].permission.downloadCallRecords.view == true){
          props.history.push(CONSTANTS.PATHS.DOWNLOAD_RECORD);
        }else if(response.data[0].permission.reports.view == true){
          props.history.push(CONSTANTS.PATHS.REPORTS);
        }else if(response.data[0].permission.roleManagement.view == true){
          props.history.push(CONSTANTS.PATHS.ROLEMANAGEMENT);
        }else if(response.data[0].permission.userMaster.view == true){
          props.history.push(CONSTANTS.PATHS.USER);
        }else if(response.data[0].permission.callCenter.view == true){
          props.history.push(CONSTANTS.PATHS.CALLCENTRE);
        }
      } else {
        // setIsLoading(false);
        handle_error(response.status);
      }
    } else {
      const emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
      const validEmail = emailPattern.test(String(email));

      setErrorEmail(isEmpty(email) ? true : !validEmail ? true : false);
      setErrorPassword(isEmpty(password));
    }
  };
  const clickLogin =()=>{
    login()
  }

  useEffect(() => {
    if (!isEmpty(localStorage.getItem("isAuthenticated"))) {
      window.location.reload();
    }
    localStorage.clear();
  }, [invalidLogin]);
  return (
    <>
      <div className="bg">
        <div className="body">
          <div className="body-img" />

          <div className="form">
            <div className="form-logo" />
            <Textbox
              styleClass="form-input"
              placeholder="Email Address"
              id="emailInput"
              textChange={(e) => {
                onEmailChange(e);
              }}
              error={errorEmail}
              value={email}
            />
            {errorEmail ? (
              <small className="text-danger font-weight-bold">
                Please enter valid email address
              </small>
            ) : (
              ""
            )}
            <PasswordTextbox
              eyeClass="fa fab fa-eye"
              pwdId="password"
              styleClass=" form-input "
              placeholder="Password"
              textChange={onPasswordChange}
              error={errorPassword}
              value={password}
              tooltip="Show/Hide password"
              onLogin= {onLogin}
            />
            {errorPassword ? (
              <small className="text-danger font-weight-bold">
                Please enter valid password
              </small>
            ) : (
              ""
            )}
            <Button
              id="loginButton"
              styleClass="form-button"
              onClick={login}
              text="Sign In"
            />
            {invalidLogin ? (
              <small className="text-danger font-weight-bold">
                Please enter valid credentials
              </small>
            ) : (
              ""
            )}
            {/* <PasswordTextbox/> */}
          </div>
        </div>
      </div>
      {/* <Loader/> */}
    </>
  );
}