import React, { useState, useEffect } from "react";
import axios from "axios";
import "../stylesheets/usermaster.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import { toast } from "react-toastify";
import Button from "../components/common/button";
import Textbox from "../components/common/textbox";
import Dropdown from "../components/common/dropdown";
import ajax from "../utils/ajax";
import handle_error from "../utils/handle";
import CONSTANTS from "../utils/constants";
import Edit from "../images/edit.svg";
import Delete from "../images/delete.svg";
import Filter from "../images/Group 107454.svg";
import Close from "../images/close.svg";
import calenderImage from "../images/Icon metro-calendar.svg";
import SearchIcon from "../images/Search_image_white.png";

import "../stylesheets/common/date-picker.css";
import "react-datepicker/dist/react-datepicker.css";
import "../stylesheets/common/button.css";
import isEmpty from "../utils/isEmpty";
import Loader from "../components/common/loader";
import userAjax from "../utils/userAjax";
import roleAjax from "../utils/roleAjax";
import callCenterAjax from "../utils/callCenterAjax";
import encryptData from "../components/common/crypto";
import { string } from "prop-types";
import ReactPaginate from "react-paginate";
toast.configure();
let temp = localStorage.getItem("ENCRYPTED_DATA");
let PERMISSION = temp ? JSON.parse(encryptData(temp, "dec")) : {};
// const PERMISSION = JSON.parse(encryptData(localStorage.getItem("ENCRYPTED_DATA"),"dec"))
const Usermaster = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextLimit, setNextLimit] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
    // const [editModal, setEditModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortAs, setSortAs] = useState("desc");
  const [addFirstName, setAddFirstName] = useState("");
  const [addLastName, setAddLastName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addMobile, setAddMobile] = useState("");
  const [addUserName, setAddUserName] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addCallCentre, setAddCallCentre] = useState("");
  const [addRole, setAddRole] = useState("");
  const [callCenterData, setCallCenterData] = useState("");
  const [userId, setUserId] = useState("");
  const [roleData, setRoleData] = useState([]);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorValidFirstName, setErrorValidFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorValidLastName, setErrorValidLastName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorValidEmail, setErrorValidEmail] = useState(false);
  const [errorMobile, setErrorMobile] = useState(false);
  const [errorValidMobile, setErrorValidMobile] = useState(false);
  const [errorUserName, setErrorUserName] = useState(false);
  const [errorValidUserName, setErrorValidUserName] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorValidPassword, setErrorValidPassword] = useState(false);
  const [errorCallCenter, setErrorCallCenter] = useState(false);
  const [errorRoleId, setErrorRoleId] = useState(false);
  const [action, setAction] = useState("");
  const [query, setQuery] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  

  function FetchURL(query, startD, endD) {
    const commonParams = "?limit=10&offset=0&orderBy=asc&columnName=user_id&userType=Admin";
    if (query && startD && endD) {
      return `${commonParams}&fromDate=${startD}&toDate=${endD}&email=${query}`;
    } else if (startD && endD) {
      return `${commonParams}&fromDate=${startD}&toDate=${endD}`;
    } else if (query) {
      return `${commonParams}&email=${query}`;
    } else {
      return commonParams;
    }
  }
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      getUserData();
    }
  };

  const onNext = async () => {
    setLoading(true);
    setOffset(offset + limit);
    const startD = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const endD = endDate ? moment(endDate).format("YYYY-MM-DD") : null;

    setCurrentPage(currentPage + 1);
    const response = await userAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_ALL_USER}/${localStorage.getItem(
        "IS_ADMIN"
      )}/${localStorage.getItem("USER_NAME")}/${localStorage.getItem(
        "CALL_CENTER_ID"
      )}/${limit}/${offset + limit}/${startD}/${endD}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
      // `${CONSTANTS.API.GET_ALL_USER}`
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
      setNextLimit(totalPages === currentPage + 1);
      setLoading(false);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setData([]);
      setLoading(true);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
    } else {
      setData([]);
      setLoading(true);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
      handle_error(response.status, response.message);
    }
  };
  const onPrevious = async () => {
    setLoading(true);
    setOffset(offset - limit);
    setCurrentPage(currentPage - 1);
    const startD = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const endD = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
    const response = await userAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_ALL_USER}/${localStorage.getItem(
        "IS_ADMIN"
      )}/${localStorage.getItem("USER_NAME")}/${localStorage.getItem(
        "CALL_CENTER_ID"
      )}/${limit}/${offset - limit}/${startD}/${endD}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
      // `${CONSTANTS.API.GET_ALL_USER}`
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
      setNextLimit(totalPages === currentPage - 1);
      setLoading(false);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setData([]);
      setLoading(true);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
    } else {
      setData([]);
      setLoading(true);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
      handle_error(response.status, response.message);
    }
  };
  const handlePageClick = async (data) => {
    console.log('data>>>>>>>',data)
    const selectedPage = data.selected;
    console.log('selectedPage >>>>>>>>.',selectedPage )
    const newOffset = selectedPage * limit;
  
    setLoading(true);
  
    try {
      const response = await userAjax(
        CONSTANTS.API_METHODS.GET,
        // `${CONSTANTS.API.GET_ALL_USER}/${localStorage.getItem("USER_NAME")}/${localStorage.getItem("IS_ADMIN")}/${sortAs}/${limit}/${newOffset}`,
        `${CONSTANTS.API.GET_ALL_USER}?limit=${limit}&offset=${newOffset }&orderBy=${"asc"}&columnName=user_id&userType=Admin`,
        {},
        { id: localStorage.getItem("USER_ID") },
        {}
      );
  
      if (response.status === CONSTANTS.STATUS.OK) {
        console.log('response.data',response)
        setData(response.data);
        setOffset(newOffset);
        setCount(response.totalCount);
        setCurrentPage(selectedPage + 1);
        setLoading(false);
      } 
      // else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      //   setData([]);
      //   setLoading(false);
      //   setCount(0);
      //   setTotalPage(0);
      //   setCurrentPage(0);
      //   setNextLimit(false);
      // } 
      else {
        // setData([]);
        // setCount(0);
        // setTotalPage(0);
        // setCurrentPage(0);
        // setNextLimit(false);
        handle_error(response.status, response.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const renderTableRows = () => {
    if (data?.length > 0) {
      return data.map((item) => (
        <tr>
          <td className="table-data">
            {isEmpty(item.user_name) ? "-" : item.user_name}
          </td>
          <td className="table-data">
            {isEmpty(item.first_name) ? "-" : item.first_name}
          </td>
          <td className="table-data">
            {isEmpty(item.last_name) ? "-" : item.last_name}
          </td>
          <td className="table-data">
            {isEmpty(item.user_email) ? "-" : item.user_email}
          </td>
          <td className="table-data">
            {isEmpty(item.phone_no) ? "-" : item.phone_no}
          </td>
          <td className="table-data">
            {isEmpty(item.name_category) ? "-" : item.name_category}
          </td>
          <td className="table-data">
            {item.created_at === null
              ? " "
              : moment(item.created_at).format("DD-MM-YYYY")}
          </td>
          <td className="table-data">
            {isEmpty(item.role_name) ? "-" : item.role_name}
          </td>
          <td className="table-data">
            {PERMISSION.userMaster && (
              <>
                {PERMISSION.userMaster.edit && (
                  <div className="table-data-icon">
                    <img
                      alt=""
                      className="table-edit-icon"
                      src={Edit}
                      onClick={() => onEditClick(item.user_id)}
                    />
                    <img
                      alt=""
                      className="table-delete-delete"
                      src={Delete}
                      onClick={() => onDeleteClick(item.user_id)}
                    />
                  </div>
                )}
              </>
            )}
          </td>
        </tr>
      ));
    }
  };
  const renderTable = () => (
    <>
      <table className="table table-bordered">
        <thead className="tablehead">
          <tr>
            <th className="table-head" scope="col">
              User Name
             
            </th>
            <th className="table-head" scope="col">
              First Name
             
            </th>
            <th className="table-head" scope="col">
              Last Name
             
            </th>
            <th className="table-head" scope="col">
              E-mail ID
              
            </th>
            <th className="table-head" scope="col">
              Mobile No
              
            </th>
            <th className="table-head" scope="col">
              Call Center
             
            </th>
            <th className="table-head" scope="col">
              Created Date
             
            </th>
            <th className="table-head" scope="col">
              Role
            
            </th>
            <th className="table-head" scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{count !== 0 && renderTableRows()}</tbody>
      </table>
      {loading === false && count === 0 && (
        <div className="text-center">No data found</div>
      )}
    </>
  );
  const getUserData = async () => {
    setLoading(true);
    const startD = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const endD = endDate
      ? moment(endDate).add(1, "days").format("YYYY-MM-DD")
      : null;
    const fetchURL = FetchURL(query, startD, endD);
    const response = await userAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_ALL_USER}${fetchURL}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
      // `${CONSTANTS.API.GET_ALL_USER}`
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response?.data);
      setCount(response?.totalCount);

      const totalPages = Math.ceil(response?.totalCount / limit);
      setTotalPage(totalPages);
      setNextLimit(totalPages === currentPage);
      setLoading(false);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setData([]);
      setLoading(false);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
    } else {
      setData([]);
      setLoading(false);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
      handle_error(response.status, response.message);
    }
  };
  const setSort = (e) => {
    setSortBy(e);
    setSortAs(sortAs === "desc" ? "asc" : "desc");
    getUserData();
  };
  const isValid = () => {
    if (!isEmpty(addEmail)) {
      const emailPattern = new RegExp(/^\S+@\S+\.\S+/);
      const validEmail = emailPattern.test(String(addEmail));
      if (validEmail == false) {
        setErrorValidEmail(true);
        return false;
      } else {
        setErrorValidEmail(false);
      }
    }
    if (!isEmpty(addMobile)) {
      const mobilePattern = new RegExp(/^\d{10}$/);
      const validMobile = mobilePattern.test(String(addMobile));
      if (validMobile == false) {
        setErrorValidMobile(true);
        return false;
      } else {
        setErrorValidMobile(false);
      }
    }
    if (!isEmpty(addFirstName)) {
      const firstNamePattern = new RegExp(/^[A-Za-z]+$/);
      const validFirstName = firstNamePattern.test(String(addFirstName));
      if (validFirstName == false) {
        setErrorValidFirstName(true);
        return false;
      } else {
        setErrorValidFirstName(false);
      }
    }
    if (!isEmpty(addLastName)) {
      const lastNamePattern = new RegExp(/^[A-Za-z]+$/);
      const validLastName = lastNamePattern.test(String(addLastName));
      if (validLastName == false) {
        setErrorValidLastName(true);
        return false;
      } else {
        setErrorValidLastName(false);
      }
    }
    if (!isEmpty(addUserName)) {
      const userNamePattern = new RegExp(/^[A-Za-z]+$/);
      const validUserName = userNamePattern.test(String(addUserName));
      if (validUserName == false) {
        setErrorValidUserName(true);
        return false;
      } else {
        setErrorValidUserName(false);
      }
    }
    if (!isEmpty(addPassword)) {
      const passPattern = new RegExp(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/
      );
      const enterValidPassword = passPattern.test(String(addPassword));
      if (enterValidPassword == false) {
        setErrorValidPassword(true);
        return false;
      } else {
        setErrorValidPassword(false);
      }
    }
    if (
      isEmpty(addFirstName) ||
      isEmpty(addLastName) ||
      isEmpty(addEmail) ||
      isEmpty(addMobile) ||
      isEmpty(addUserName) ||
      isEmpty(addPassword) ||
      isEmpty(addCallCentre) ||
      isEmpty(addRole)
    ) {
      return false;
    }
    return true;
  };
  const checkUserFirstName = (e) => {
    const firstNamePattern = new RegExp(/^[A-Za-z]+$/);
    const validFirstName = firstNamePattern.test(String(e));
    if (validFirstName == false) {
      setErrorValidFirstName(true);
      return false;
    } else {
      setErrorValidFirstName(false);
    }
  };
  const checkUserLastName = (e) => {
    const lastNamePattern = new RegExp(/^[A-Za-z]+$/);
    const validLastName = lastNamePattern.test(String(e));
    if (validLastName == false) {
      setErrorValidLastName(true);
      return false;
    } else {
      setErrorValidLastName(false);
    }
  };
  const checkUserEmail = (e) => {
    const emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
    const validEmail = emailPattern.test(String(e));
    if (validEmail == false) {
      setErrorValidEmail(true);
      return false;
    } else {
      setErrorValidEmail(false);
    }
  };
  const checkUserMobile = (e) => {
    const mobilePattern = new RegExp(/^\d{10}$/);
    const validMobile = mobilePattern.test(String(e));
    if (validMobile == false) {
      setErrorValidMobile(true);
      return false;
    } else {
      setErrorValidMobile(false);
    }
  };
  const checkUserName = (e) => {
    const userNamePattern = new RegExp(/^[A-Za-z]+$/);
    const validUserName = userNamePattern.test(String(e));
    if (validUserName == false) {
      setErrorValidUserName(true);
      return false;
    } else {
      setErrorValidUserName(false);
    }
  };
  const checkUserPassword = (e) => {
    const passPattern = new RegExp(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/
    );
    const enterValidPassword = passPattern.test(String(e));
    if (enterValidPassword == false) {
      setErrorValidPassword(true);
      return false;
    } else {
      setErrorValidPassword(false);
    }
  };
  const onEditClick = async (id) => {
    setUserId(id);
    setAction(CONSTANTS.ACTION.EDIT);
    setModalOpen(true);
    // setLoading(true);

    const response = await userAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_USER_BY_ID}/${id}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    console.log(response.data[0]);
    if (response.status === CONSTANTS.STATUS.OK) {
      const newData = response.data[0];
      setAddUserName(newData.userName);
      setAddFirstName(newData.firstName);
      setAddLastName(newData.lastName);
      setAddEmail(newData.userEmail);
      setAddPassword(newData.password);
      // setAddCallCentre(newData.callCenter);
      onCallCenterChange(newData.callCenter);
      setAddRole(newData.roleId);
      setAddMobile(newData.phoneNo);
      setLoading(false);
    } else {
      handle_error(response.status, response.message);
    }
  };
const addUser = async () => {
  setLoading(true);

  if (isValid()) {
    const body = {
      firstName: addFirstName,
      lastName: addLastName,
      userName: addUserName,
      userEmail: addEmail,
      password: addPassword,
      active: true,
      roleId: addRole,
      callCenter: addCallCentre,
      phoneNo: addMobile,
    };

    if (action === CONSTANTS.ACTION.EDIT) {
      body.userId = userId;
      body.updatedBy = localStorage.getItem("USER_NAME");
    }
    if (action === CONSTANTS.ACTION.ADD) {
      body.createdBy = localStorage.getItem("USER_NAME");
    }
   
    try {
      const response = await userAjax(
        action === CONSTANTS.ACTION.ADD
          ? CONSTANTS.API_METHODS.POST
          : CONSTANTS.API_METHODS.PUT,
        action === CONSTANTS.ACTION.ADD
          ? CONSTANTS.API.ADD_USER
          : CONSTANTS.API.UPDATE_USER,
        {},
        { id: localStorage.getItem("USER_ID") },
        body
      );

      if (response.status === CONSTANTS.STATUS.OK) {
        toast.success(response.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        getUserData();
        clearFormFields();
        setModalOpen(false)
      } else {
        handle_error(response.status, response.message);
      }
    } catch (error) {
      handle_error(500, "An error occurred while making the request.");
    } finally {
      setLoading(false);
    }
  } else {
    setErrorFlags();
    setLoading(false);
  }
};

function clearFormFields() {
  setAddUserName("");
  setAddFirstName("");
  setAddLastName("");
  setAddEmail("");
  setAddPassword("");
  setAddCallCentre("");
  setAddRole("");
  setAddMobile("");
  setModalOpen(true);
}
function setErrorFlags() {
  setErrorValidFirstName(isEmpty(addFirstName));
  setErrorValidLastName(isEmpty(addLastName));
  setErrorValidEmail(isEmpty(addEmail));
  setErrorValidMobile(isEmpty(addMobile));
  setErrorValidPassword(isEmpty(addPassword));
  setErrorCallCenter(isEmpty(addCallCentre));
  setErrorRoleId(isEmpty(addRole));
  setErrorValidUserName(isEmpty(addUserName));
}
  const getCallCentreData = async () => {
    const response = await callCenterAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_CALL_CENTER}/${localStorage.getItem(
        "USER_NAME"
      )}/${localStorage.getItem("IS_ADMIN")}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    console.log(response);
    if (response.status === CONSTANTS.STATUS.OK) {
      const newData = response.data.map((val) => ({
        id: val.callcenterid,
        name: val.namecategory,
      }));
      console.log(response);
      setCallCenterData(newData);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setCallCenterData([]);
    } else {
      handle_error(response.status, response.message);
    }
  };
  const getRoleData = async (id) => {
    const response = await roleAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_CALL_CENTER_BY_ROLE}/${id}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      const newData = response.data.map((val) => ({
        id: val.roleId,
        name: val.roleName,
      }));
      setRoleData(newData);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      // setRoleData([]);
    } else {
      handle_error(response.status, response.message);
    }
  };
  const getSearchUserData = async (start, end) => {
    setLoading(true);
    const startD = start ? moment(start).format("YYYY-MM-DD") : null;
    // const endD = end ? moment(end).format('YYYY-MM-DD') : null;
    const endD = end ? moment(end).add(1, "days").format("YYYY-MM-DD") : null;
   const fetchURL = FetchURL(query, startD, endD);

    const response = await userAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_ALL_USER}${fetchURL}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response?.data);
      setCount(response?.totalCount);
      const totalPages = Math.ceil(response?.totalCount / limit);
      setTotalPage(totalPages);
      setNextLimit(totalPages === currentPage);
      setLoading(false);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setData([]);
      setLoading(false);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
    } else {
      setData([]);
      setLoading(false);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
      handle_error(response.status, response.message);
    }
  };
  useEffect(() => {
    getUserData();
    getCallCentreData();
  }, [Button]);

  const setStartDateFun = (e) => {
    setStartDate(e);
    setEndDate(null);
  };
  const setEndDateFun = (e) => {
    setEndDate(e);
    getSearchUserData(startDate, e);
  };
  const onClearDateClick = (e) => {
    setStartDate(null);
    setEndDate(null);
    getSearchUserData(null, null);
  };
  const onCallCenterChange = (e) => {
    setAddCallCentre(e);
    getRoleData(e);
  };
  const onDeleteClick = async (id) => {
    setLoading(true);

    const response = await userAjax(
      CONSTANTS.API_METHODS.DELETE,
      CONSTANTS.API.DELETE_USER,
      { userId: id },
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setLoading(false);
      getUserData();
      toast.success(response.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      setLoading(false);
      handle_error(response.status, response.message);
    }
  };
  return (
    <>
      <div className={`content ${loading || modalOpen ? "loading-blur" : ""}`}>
        {loading && <Loader />}
        <div className="centre">
          <div className="headerline">
            <div className="headertag">
              <b>User Master</b>
            </div>
            <div className="filterContainer  ">
              <div className="search-container">
                <input
                  className="forplaceholder"
                  type="text"
                  placeholder="Email ID"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleEnterKey}
                />
                <div className="bgcolor_serchIcon" onClick={getUserData}>
                  <img
                    className="search-icon"
                    src={SearchIcon}
                    alt="Search"
                    title="Enter For Search"
                  />
                </div>
              </div>

              <div
                className=" filterAppointmentStart d-flex mr-2 "
                style={{
                  border: "2px solid #ED1C24",
                  borderRadius: "5px",
                  padding: "4px",
                  height: "2.5em",
                }}
              >
                <DatePicker
                  className="border border-0  coloe hideOutline text-dark date-border"
                  placeholderText="Start Date"
                  selected={startDate}
                  onChange={(date) => setStartDateFun(date)}
                  // timeInputLabel="Time:"
                  dateFormat="dd/MM/yyyy"
                    // showTimeInput
                  maxDate={new Date()}

                  // disabled={false}
                />
                <img
                  className="pointer calEndDateIcon mt-1 "
                  src={calenderImage}
                  alt="Logo"
                  height="25"
                  width="25"
                />
              </div>
              <div
                className="filterAppointmentStart d-flex"
                style={{
                  border: "2px solid #ED1C24",
                  borderRadius: "5px",
                  padding: "4px",
                  height: "2.5em",
                }}
              >
                <DatePicker
                  className="border border-0 coloe hideOutline text-dark date-border"
                  placeholderText="End Date"
                  selected={endDate}
                  onChange={(date) => {
                    setEndDateFun(date);
                  }}
                  // timeInputLabel="Time:"
                  dateFormat="dd/MM/yyyy"
                  // showTimeInput
                  disabled={isEmpty(startDate)}
                  minDate={startDate}
                  maxDate={new Date()}
                  title={
                    isEmpty(startDate) ? "Please select start date first." : ""
                  }
                />
                <img
                  className="pointer calEndDateIcon mt-1 "
                  src={calenderImage}
                  alt="Logo"
                  height="25"
                  width="25"
                />
              </div>
            </div>
            <div className="header-buttons">
              {/* <button type="button" class="btn btn-light mr-3 clear-date">Clear Date</button> */}
              <Button
                styleClass="standardButton standardLightButton clear-date"
                text="Reset Date"
                onClick={() => {
                  onClearDateClick();
                }}
              />
              {PERMISSION.userMaster && (
                <>
                  {PERMISSION.userMaster.add && (
                    <Button
                      styleClass="standardButton standardDarkButton"
                      text="Add User"
                      onClick={() => {
                        setModalOpen(true);
                        setAction(CONSTANTS.ACTION.ADD);
                        clearFormFields();
                        setIsNewUser(true);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
          {/* <div className="table1 table-responsive">  commented fot UO alignment changes*/}
          <div >
            <div className="ctc-table">
              {renderTable()}
              <div  className="pagination-container  mt-2">
              {loading === false && count !== 0 && (
                      <ReactPaginate
                      previousLabel={'Previous'}
                      nextLabel={'Next'}
                      breakLabel={'...'}
                      pageCount={totalPage}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                      nextLinkClassName={'nextButtonLink'}
                      previousLinkClassName={'previousButtonLink'}
                      forcePage={currentPage - 1}
                    />
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalOpen ? (
        <>
          {/* <div class="modal-body"> */}
          <div className="modalBackground">
            <div
              className={`modalContainerUserMaster ${
                errorFirstName ||
                errorLastName ||
                errorMobile ||
                errorCallCenter
                  ? "modalContainerUserMasterError"
                  : ""
              }`}
            >
              <div className="add-role-modal-header d-flex justify-content-between">
                <div className="add-role-modal">
                  <b>{`${
                    action === CONSTANTS.ACTION.ADD ? "Add User" : "Update User"
                  }`}</b>
                </div>
                <div className="titleCloseBtn flex-row-reverse">
                  <img
                    alt=""
                    className="table-close-icon"
                    src={Close}
                    onClick={() => setModalOpen(false)}
                  />
                </div>
              </div>
              <div className="title ">
                <div className="d-flex ">
                  <div className="mr-auto p-3 aligntextbox">
                    <Textbox
                      textLabel="First Name"
                      required=""
                      name="Firstname"
                      id="Firstname"
                      value={addFirstName}
                      // styleClass='txt-position'
                      onChange={(e) => {
                        checkUserFirstName(e.target.value);
                        setAddFirstName(e.target.value);
                      }}
                    />
                    {errorFirstName ? (
                      <small className="text-danger font-weight-bold">
                        Please enter first name
                      </small>
                    ) : (
                      ""
                    )}
                    {errorValidFirstName ? (
                      <small className="text-danger font-weight-bold">
                        Please enter valid first name
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="p-3 aligntextbox">
                    <Textbox
                      textLabel="Last Name"
                      required=""
                      name="Last Name"
                      id="Last Name"
                      value={addLastName}
                      onChange={(e) => {
                        checkUserLastName(e.target.value);
                        setAddLastName(e.target.value);
                      }}
                    />
                    {errorLastName ? (
                      <small className="text-danger font-weight-bold">
                        Please enter last name
                      </small>
                    ) : (
                      ""
                    )}
                    {errorValidLastName ? (
                      <small className="text-danger font-weight-bold">
                        Please enter valid last name
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="mr-auto p-3 aligntextbox1">
                    <Textbox
                      textLabel="Email ID"
                      required=""
                      name="EmailID"
                      id="EmailID"
                      value={addEmail}
                      onChange={(e) => {
                        checkUserEmail(e.target.value);
                        setAddEmail(e.target.value);
                      }}
                    />
                    {errorEmail ? (
                      <small className="text-danger font-weight-bold">
                        Please enter valid email id
                      </small>
                    ) : (
                      ""
                    )}
                    {errorValidEmail ? (
                      <small className="text-danger font-weight-bold">
                        Please enter valid email id
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mr-auto p-3 aligntextbox1">
                    <Textbox
                      textLabel="Mobile Number"
                      required=""
                      name="MobileNumber"
                      id="MobileNumber"
                      value={addMobile}
                      onChange={(e) => {
                        checkUserMobile(e.target.value);
                        setAddMobile(e.target.value);
                      }}
                    />
                    {errorMobile ? (
                      <small className="text-danger font-weight-bold">
                        Please enter valid mobile no
                      </small>
                    ) : (
                      ""
                    )}
                    {errorValidMobile ? (
                      <small className="text-danger font-weight-bold">
                        Please enter valid mobile no
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="mr-auto p-3 aligntextbox1">
                    <Textbox
                      textLabel="User Name"
                      required=""
                      name="UserName"
                      id="UserName"
                      value={addUserName}
                      onChange={(e) => {
                        checkUserName(e.target.value);
                        setAddUserName(e.target.value);
                      }}
                    />
                    {errorUserName ? (
                      <small className="text-danger font-weight-bold">
                        Please enter user name
                      </small>
                    ) : (
                      ""
                    )}
                    {errorValidUserName ? (
                      <small className="text-danger font-weight-bold">
                        Please enter valid user name
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mr-auto p-3 aligntextbox1">
                    <Textbox
                      textLabel="Password"
                      required=""
                      type="password"
                      name="Password"
                      id="Password"
                      value={addPassword}
                      onChange={(e) => {
                        checkUserPassword(e.target.value);
                        setAddPassword(e.target.value);
                      }}
                    />
                    {errorPassword ? (
                      <small className="text-danger font-weight-bold">
                        Please enter password
                      </small>
                    ) : (
                      ""
                    )}
                    {errorValidPassword ? (
                      <small className="text-danger font-weight-bold">
                        Enter strong password
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="mr-auto p-3 mb-3 aligntextbox1">
                    <Dropdown
                      id="callcentre"
                      name="callcentre"
                      value={addCallCentre}
                      labelText=""
                      dropdownLabel="Call Center"
                      options={callCenterData}
                      onDropDownChange={(e) => {
                        onCallCenterChange(e.target.value);
                      }}
                    />
                    {errorCallCenter ? (
                      <small className="text-danger font-weight-bold">
                        Please select call center
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mr-auto p-3 mb-3 aligntextbox1">
                    <Dropdown
                      id="Role"
                      name="role"
                      value={addRole}
                      labelText=""
                      dropdownLabel="Role"
                      options={roleData}
                      onDropDownChange={(e) => {                                                                                                                                                                                                                                                                                                                                                                                                          
                        setAddRole(e.target.value);
                      }}
                    />
                    {errorRoleId ? (
                      <small className="text-danger font-weight-bold">
                        Please select role
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="modalContainerbody">
                <div className="d-flex mx-2">
                  <div className="addrolebtn">
                    <Button
                      styleClass="standardButton standardDarkButton"
                      text={`${
                        action === CONSTANTS.ACTION.ADD
                          ? "Add User"
                          : "Update User"
                      }`}
                      onClick={() => {
                        addUser();
                      }}
                    />
                  </div>
                  <Button
                    styleClass="standardButton standardLightButton"
                    text="Cancel"
                    onClick={() => {
                      setModalOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </>
      ) : (
        ""
      )}
    </>
  );
};
export default Usermaster;
