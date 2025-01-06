import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./stylesheets/masterpage.css";
import CONSTANTS from "./utils/constants";
import "../src/bootstrap/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// IMPORTING PAGES FOR ROUTING
import Sidebar from "./components/common/sidebar";
import Login from "./pages/login";
import Callcentre from "./pages/call_center";
import MetadataRecord from "./pages/metadata_record";
import CallRecord from "./pages/call_record";
import Navbar from "./components/common/navbar";
import Usermaster from "./pages/user_master";
import RoleManagement from "./pages/role_management";
import Reports from "./pages/reports";
import DownloadRecord from "./pages/download_call_records";
import Error from "./components/common/error";
import encryptData from "./components/common/crypto";
import Axios from "axios";

function MasterPage() {
  const [isAuthenticated, setAuthentication] = useState(false);
  const checkAuthentication = () => {
    
    if (
      localStorage.length !== 0 &&
      localStorage.getItem("isAuthenticated") !== null &&
      localStorage.getItem("isAuthenticated").toLowerCase() === "true"
    ) {
      setAuthentication(true);
      return true;
    }
    localStorage.setItem("isAuthenticated", false);
    setAuthentication(false);
    return false;
  };
  
  let temp = localStorage.getItem("ENCRYPTED_DATA")
  let permission = temp ? JSON.parse(encryptData(temp,"dec")) : {}
  
  const checkPermission = ({ path }) => true;
  const CustomRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        checkAuthentication() ? (
          checkPermission({ ...rest }) ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: CONSTANTS.PATHS.ROLEMANAGEMENT,
              }}
            />
          )
        ) : (
          <Redirect
            to={{
              pathname: CONSTANTS.PATHS.LOGIN,
            }}
          />
        )
      }
    />
  );

  // if (
  //   localStorage.length !== 0 &&
  //   localStorage.getItem("isAuthenticated") !== null &&
  //   localStorage.getItem("isAuthenticated").toLowerCase() === "true"
  // ){
  //  if(window.location.pathname != CONSTANTS.PATHS.ROLEMANAGEMENT){
  Axios.interceptors.request.use(request=>{
    let newURL = request.url
    let urlCheck = newURL.split('/')
      if(urlCheck[2] != 's3.ap-south-1.amazonaws.com'){
      // if(urlCheck[2] != 'ombuck.s3.ap-south-1.amazonaws.com'){
      // if(urlCheck[2] != 's3buildpath3.s3.ap-south-1.amazonaws.com'){
        request.headers['Authorization'] = 'Basic ' + window.btoa("hdfclifecallvault" + ":" + "hdfclifecallvault@callcenter")
        return request
      } else {
        return request
      }
    })
  // }

  return (
    <>
      <Router>
        <Switch>
          <div className="master">
            {window.location.pathname === CONSTANTS.PATHS.DEFAULT ||
            window.location.pathname === CONSTANTS.PATHS.LOGIN ||
            isAuthenticated === false ? (
              ""
            ) : (
              <>
                <Sidebar />
                <Navbar />
              </>
            )}

            <Route exact path={CONSTANTS.PATHS.DEFAULT} component={Login} />
            <Route exact path={CONSTANTS.PATHS.LOGIN} component={Login} />
            <CustomRoute
              exact
              path={CONSTANTS.PATHS.USER}
              component={
                permission?.userMaster
                  ?.view === true
                  ? Usermaster
                  : Error
              }
            />
            <CustomRoute
              exact
              path={CONSTANTS.PATHS.ROLEMANAGEMENT}
              component={
                permission?.roleManagement
                  ?.view === true
                  ? RoleManagement
                  : Error
              }
            />
            <CustomRoute
              exact
              path={CONSTANTS.PATHS.CALLCENTRE}
              component={
                permission?.callCenter
                  ?.view === true
                  ? Callcentre
                  : Error
              }
            />
            <CustomRoute
              exact
              path={CONSTANTS.PATHS.METADATA_RECORD}
              component={
                permission?.callRecords
                  ?.view === true
                  ? MetadataRecord
                  : Error
              }
            />
            <CustomRoute
              exact
              path={CONSTANTS.PATHS.REPORTS}
              component={
                permission?.reports
                  ?.view === true
                  ? Reports
                  : Error
              }
            />
            <CustomRoute
              exact
              path={CONSTANTS.PATHS.CALL_RECORD}
              component={
                permission?.callRecords
                  ?.view === true
                  ? CallRecord
                  : Error
              }
            />
            <CustomRoute
              exact
              path={CONSTANTS.PATHS.DOWNLOAD_RECORD}
              component={
                permission
                  ?.downloadCallRecords?.view === true
                  ? DownloadRecord
                  : Error
              }
            />
          </div>
        </Switch>
      </Router>
    </>
  );
}

export default MasterPage;
