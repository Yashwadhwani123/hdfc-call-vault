import React, { useState, useEffect } from "react";
import axios from "axios";

// import Topnav from "../components/common/topnav";
// import Sidebar from "../components/common/sidebar";
import CONSTANTS from "../utils/constants";
// import API from "../utils/ajax";
import "../stylesheets/rolemanagement.css";
import "../stylesheets/common/modal.css";
import Button from "../components/common/button";
import Textbox from "../components/common/textbox";
import Dropdown from "../components/common/dropdown";
import Edit from "../images/edit.svg";
import Delete from "../images/delete.svg";
import Close from "../images/close.svg";
// import ajax from '../utils/ajax';
import handle_error from "../utils/handle";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import isEmpty from "../utils/isEmpty";
// import userAjax from '../utils/userAjax';
import roleAjax from "../utils/roleAjax";
import callCenterAjax from "../utils/callCenterAjax";
import Loader from "../components/common/loader";
import encryptData from "../components/common/crypto";
import SearchIcon from "../images/Search_image_white.png";
import ReactPaginate from 'react-paginate';
export default function RoleManagement() {
  let temp = localStorage.getItem("ENCRYPTED_DATA");
  // console.log("temp",temp);
  let PERMISSION = JSON.parse(encryptData(temp, "dec"));
  // const PERMISSION = JSON.parse(encryptData(localStorage.getItem("ENCRYPTED_DATA"),"dec"))
  const [data, setData] = useState([]);
  const [rolename, setRolename] = useState();
  // const [roleid, setRoleId] = useState(0);
  const [nameCategory, setNameCategory] = useState();
  const [description, setDescription] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [limit] = useState(10);

  const [offset, setOffset] = useState(0);

  const [count, setCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [nextLimit, setNextLimit] = useState(false);

  const [totalPage, setTotalPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [callCenterData, setCallCenterData] = useState([]);

  const [errorRoleName, setErrorRoleName] = useState(false);
  const [errorNameCategory, setErrorNameCategory] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [testData, setTestData] = useState([]);
  const [addRoleData, setAddRoleData] = useState([]);
  const [editrolename, setEditRolename] = useState();
  const [editnameCategory, setEditNameCategory] = useState();
  const [editdescription, setEditDescription] = useState();
  const [editRoleId, setEditRoleId] = useState();
  const [errorEditRoleName, setErrorEditRoleName] = useState(false);
  const [errorEditNameCategory, setErrorEditNameCategory] = useState(false);
  const [errorEditDescription, setErrorEditDescription] = useState(false);
  const [editRoleData, setEditRoleData] = useState([]);
  const [defaultFields, setDefaultFields] = useState([]);
  const [query, setQuery] = useState("");
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      getRolesData(true);
    }
  };
  const handlePageClick = async (data) => {
    const selectedPage = data.selected;
    const newOffset = (selectedPage * limit );
  
    setLoading(true);
  
    const response = await callCenterAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_ROLES}?offset=${newOffset }&orderBy=${"asc"}&userType=Admin&limit=${limit}`,

      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    
    );
  
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setOffset(newOffset);
      setCurrentPage(selectedPage + 1);
      setLoading(false);
    } else {
      setLoading(false);
      handle_error(response.status, response.message);
    }
  };
  const test = (e) => {
    const data = e;
    const final = [];
    const newData = data.map((e) => {
      const item = {
        fieldId: e.fieldId,
        fieldName: e.fieldName,
        view: false,
        add: false,
        edit: false,
      };
      final.push(item);
      return item;
    });
    setTestData(final);
    return newData;
  };

  const rowEdit = async (callcenterId, roleId, roleName, roleDescription) => {
    setEditNameCategory(`${callcenterId}`);
    setEditRolename(roleName);
    setEditDescription(roleDescription);
    setEditRoleId(roleId);
    const response = await roleAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_ROLES_BY_ID}/${callcenterId}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      const temp = response.data.filter((x) => x.roleId === roleId);
      let temp2 = [...temp[0].permissionDetails];
      temp2 = temp2.map((item) => {
        let tempName = "";
        defaultFields.forEach((item2) => {
          if (item2.fieldId === item.fieldId) {
            tempName = item2;
          }
        });
        const newItem = {
          ...item,
          fieldName: tempName.fieldName,
        };
        tempName = "";
        return newItem;
      });
      setEditRoleData([...temp2]);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setEditRoleData([]);
    } else {
      handle_error(response.status, response.message);
    }
    setEditModal(true);
  };

  const renderEditRoleTable = () => (
    <>
      <table className="table table-bordered">
        <thead className="tablehead">
          <tr>
            <th className="addRole-table-head" scope="col">
              Fields
            </th>
            <th className="addRole-table-head" scope="col">
              View
            </th>
            <th className="addRole-table-head" scope="col">
              Add
            </th>
            <th className="addRole-table-head" scope="col">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{renderEditRoleTableRows()}</tbody>
      </table>
    </>
  );

  const renderEditRoleTableRows = () => {
    if (editRoleData.length > 0) {
      return editRoleData.map((item, index) => (
        <tr key={index}>
          <td className="addRole-table-data">{item.fieldName}</td>
          <td className="addRole-table-data">
            <input
              value={item.fieldId}
              type="checkbox"
              checked={item.view}
              onChange={(e) => {
                const temp = editRoleData;
                temp[index].view = !temp[index].view;
                setAddRoleData([...temp]);
              }}
            />
          </td>
          <td className="addRole-table-data">
            <input
              value={item.fieldId}
              type="checkbox"
              checked={item.add}
              onChange={(e) => {
                const temp = editRoleData;
                temp[index].add = !temp[index].add;
                setAddRoleData([...temp]);
              }}
            />
          </td>
          <td className="addRole-table-data">
            <input
              value={item.fieldId}
              type="checkbox"
              checked={item.edit}
              onChange={(e) => {
                const temp = editRoleData;
                temp[index].edit = !temp[index].edit;
                setAddRoleData([...temp]);
              }}
            />
          </td>
        </tr>
      ));
    }
  };
  const renderAddRoleTableRows = () => {
    // const count = 0;
    if (testData.length > 0) {
      return testData.map((item, index) => (
        <tr key={index}>
          <td className="addRole-table-data">{item.fieldName}</td>
          <td className="addRole-table-data">
            <input
              value={item.fieldId}
              type="checkbox"
              checked={item.view}
              onChange={(e) => {
                const temp = testData;
                temp[index].view = !temp[index].view;
                setAddRoleData([...temp]);
              }}
            />
          </td>
          <td className="addRole-table-data">
            <input
              value={item.fieldId}
              type="checkbox"
              checked={item.add}
              onChange={(e) => {
                const temp = testData;
                temp[index].add = !temp[index].add;
                setAddRoleData([...temp]);
              }}
            />
          </td>
          <td className="addRole-table-data">
            <input
              value={item.fieldId}
              type="checkbox"
              checked={item.edit}
              onChange={(e) => {
                const temp = testData;
                temp[index].edit = !temp[index].edit;
                setAddRoleData([...temp]);
              }}
            />
          </td>
        </tr>
      ));
    }
  };
  const renderAddRoleTable = () => (
    <>
      <table className="table table-bordered">
        <thead className="tablehead">
          <tr>
            <th className="addRole-table-head" scope="col">
              Fields
            </th>
            <th className="addRole-table-head" scope="col">
              View
            </th>
            <th className="addRole-table-head" scope="col">
              Add
            </th>
            <th className="addRole-table-head" scope="col">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{renderAddRoleTableRows()}</tbody>
      </table>
    </>
  );

  const renderTable = () => (
    <>
      <table className="table table-bordered">
        <thead className="tablehead">
          <tr>
            <th className="table-head" scope="col">
              Roles
            </th>
            <th className="table-head" scope="col">
              Call Center
            </th>
            <th className="table-head" scope="col">
              Created By
            </th>
            <th className="table-head" scope="col">
              Created Date
            </th>
            <th className="table-head" scope="col">
              Access
            </th>
            <th className="table-head" scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      {loading === false && count === 0 && (
        <div className="text-center">No data found</div>
      )}
    </>
  );
  const renderTableRows = () => {
    if (data?.length > 0) {
      return data.map((item) => (
        <tr>
          <td className="table-data">{item?.roleName}</td>
          <td className="table-data">{item?.callCenterName}</td>
          <td className="table-data">{item?.createdBy}</td>
          <td className="table-data">
            {moment(item.createdAt).format("DD-MM-YYYY")}
          </td>
          <td className="table-data">
            {/* {item?.access} */}
            {item?.permissionDetails.map((e) => {
              if (e.fieldId === 1) {
                if (e.add === true && e.edit === true && e.view === true) {
                  return "All";
                }
                if (e.add === true && e.edit === true && e.view === false) {
                  return "Upload, Edit";
                }
                if (e.add === true && e.edit === false && e.view === true) {
                  return "Upload, View";
                }
                if (e.add === true && e.edit === false && e.view === false) {
                  return "Upload";
                }
                if (e.add === false && e.edit === true && e.view === true) {
                  return "Edit, View";
                }
                if (e.add === false && e.edit === true && e.view === false) {
                  return "Edit";
                }
                if (e.add === false && e.edit === false && e.view === true) {
                  return "View";
                }
                if (e.add === false && e.edit === false && e.view === false) {
                  return "No Access";
                }

                return "No Access";
              }
            })}
          </td>
          <td className="table-data">
            <div className="table-data-icon">
              {PERMISSION.roleManagement && (
                <>
                  {PERMISSION.roleManagement.edit && (
                    <img
                      alt=""
                      className="table-edit-icon"
                      src={Edit}
                      onClick={() =>
                        rowEdit(
                          item.callCenterId,
                          item.roleId,
                          item.roleName,
                          item.roleDescription
                        )
                      }
                    />
                  )}
                </>
              )}
              {PERMISSION.roleManagement && (
                <>
                  {PERMISSION.roleManagement.edit && (
                    <img
                      alt=""
                      className="table-delete-delete"
                      src={Delete}
                      onClick={() => roleDelete(item.roleId)}
                    />
                  )}
                </>
              )}
            </div>
          </td>
        </tr>
      ));
    }
  };

  const getCallCentre = async () => {
    const response = await callCenterAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_CALL_CENTER}/${localStorage.getItem(
        "USER_NAME"
      )}/${localStorage.getItem("IS_ADMIN")}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );

    if (response.status === CONSTANTS.STATUS.OK) {
      const newData = response.data.map((val) => ({
        id: val.callcenterid,
        name: val.namecategory,
      }));

      setCallCenterData(newData);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setData([]);
    } else {
      handle_error(response.status, response.message);
    }
  };

  const getfields = async () => {
    const response = await roleAjax(
      CONSTANTS.API_METHODS.GET,
      CONSTANTS.API.GET_FIELD,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      //   setFieldData(response.data);
      setDefaultFields([...response.data]);
      test(response.data);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      //   setFieldData([]);
    } else {
      handle_error(response.status, response.message);
    }
  };
  const isValid = () => {
    if (isEmpty(rolename) || isEmpty(nameCategory) || isEmpty(description)) {
      return false;
    }
    return true;
  };
  const isValidUpdate = () => {
    if (
      isEmpty(editrolename) ||
      isEmpty(editnameCategory) ||
      isEmpty(editdescription)
    ) {
      return false;
    }
    return true;
  };

  const getRolesData = async (resetOffset = false) => {
    const newOffset = resetOffset ? 0 : offset;
    let fetchURL = `?offset=${ newOffset }&orderBy=asc&userType=Admin&limit=${limit}`;
   if(query){
    fetchURL += `&callCenterName=${query}`;    
  }
    const response = await roleAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_ROLES}${fetchURL}`,

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
      handle_error(response.status, response.message);
      setData([]);
      setLoading(false);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
      handle_error(response.status, response.message);
    }
  };

  const addRole = async () => {
    const testData = addRoleData.map((e) => {
      const item = {
        fieldId: e.fieldId,
        view: e.view,
        add: e.add,
        edit: e.edit,
      };
      return  item;

    });
    if (isValid()) {
      const body = {
        roleName: rolename,
        roleDescription: description,
        createdBy: localStorage.getItem("USER_NAME"),
        permissionDetails: testData,
        callCenterId: nameCategory,
      };
      const response = await roleAjax(
        CONSTANTS.API_METHODS.POST,
        CONSTANTS.API.ADD_ROLE,
        {},
        { id: localStorage.getItem("USER_ID") },
        body
      );
      if (response.status === CONSTANTS.STATUS.CREATED) {
        setModalOpen(false);
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
        getRolesData();
        setRolename("");
        setNameCategory("");
        setDescription("");
      } else if (response.status === CONSTANTS.STATUS.OK) {
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
      } else {
        handle_error(response.status, response.message);
      }
    } else {
      setErrorRoleName(isEmpty(rolename));
      setErrorNameCategory(isEmpty(nameCategory));
      setErrorDescription(isEmpty(description));
    }
  };

  const UpdateRole = async () => {
    const testData = editRoleData.map((e) => {
      const item = {
        permissionId: e.permissionId,
        roleId: e.roleId,
        fieldId: e.fieldId,
        view: e.view,
        add: e.add,
        edit: e.edit,
      };
      return item;
    });
    if (isValidUpdate()) {
      const body = {
        roleId: editRoleId,
        roleName: editrolename,
        roleDescription: editdescription,
        createdAt: moment().toISOString(),
        createdBy: "Admin",
        //   updatedAt: "",
        updatedBy: "Admin",
        permissionDetails: testData,
        callCenterId: editnameCategory,
        active: true,
      };
      const response = await roleAjax(
        CONSTANTS.API_METHODS.PUT,
        CONSTANTS.API.UPDATE_ROLE,
        {},
        { id: localStorage.getItem("USER_ID") },
        body
      );
      if (response.status === CONSTANTS.STATUS.OK) {
        getRolesData();
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
        handle_error(response.status, response.message);
      }
    } else {
      setErrorRoleName(isEmpty(rolename));
      setErrorNameCategory(isEmpty(nameCategory));
      setErrorDescription(isEmpty(description));
    }
  };

  const roleDelete = async (id) => {
    setLoading(true);

    const response = await roleAjax(
      CONSTANTS.API_METHODS.DELETE,
      `${CONSTANTS.API.DELETE_ROLES}/${id}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setLoading(false);
      getRolesData();
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

  useEffect(() => {
    getCallCentre();
    getRolesData();
    getfields();
  }, []);
  return (
    <>
      <div className={`content ${loading || modalOpen ? "loading-blur" : ""}`}>
        {loading && <Loader />}
        <div className="centre">
          <div className="headerline">
            <div className="headertag">
              <b>Role Management</b>
            </div>
            <div className="d-flex">
              <div className="searchContainer_main">
                <div className="search-container">
                  <input
                    className="forplaceholder"
                    type="text"
                    placeholder="Call Center Name"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleEnterKey}
                  />
                  <div className="bgcolor_serchIcon" onClick={() => getRolesData(true)}>
                    <img
                      className="search-icon"
                      src={SearchIcon}
                      alt="Search"
                      title="Enter For Search"
                    />
                  </div>{" "}
                </div>
              </div>
              <div>
                {PERMISSION.roleManagement && (
                  <>
                    {PERMISSION.roleManagement.add && (
                      <Button
                        text="Add Role"
                        onClick={() => {
                          setModalOpen(true);
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="table-responsive">
  <div className="ctc-table">
    {renderTable()}
    {loading === false && count !== 0 && (
      // <nav aria-label="...">
      //   <ul className="pagination d-flex justify-content-end">
      //     <li className="page-item pointer">
      //       <span
      //         className={`previousButtonLink ${
      //           offset !== 0 ? "text-dark" : ""
      //         }`}
      //         style={{ pointerEvents: offset === 0 ? "none" : "" }}
      //         onClick={onPrevious}
      //       >
      //         Previous
      //       </span>
      //     </li>
      //     {[...Array(totalPage)].map((_, index) => (
      //       <li key={index} className="page-item pointer">
      //         <span
      //           className={`page-link noBgColor pointer text-dark ${
      //             currentPage === index + 1 ? "active" : ""
      //           }`}
      //           // onClick={() => onPageChange(index + 1)}
      //         >
      //           {index + 1}
      //         </span>
      //       </li>
      //     ))}
      //     <li className="page-item pointer">
      //       <span
      //         className={`nextButtonLink  ${
      //           nextLimit === false ? "text-dark" : ""
      //         }`}
      //         style={{
      //           pointerEvents: nextLimit === true ? "none" : "",
      //         }}
      //         onClick={onNext}
      //       >
      //         Next
      //       </span>
      //     </li>
      //   </ul>
      // </nav>
      <>
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            pageCount={totalPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName="pagination d-flex justify-content-end"
            activeClassName="active"
            nextLinkClassName={'nextButtonLink'}
            previousLinkClassName={'previousButtonLink'}
            forcePage={currentPage - 1} 
          />
        </>
    )}
  </div>
</div>

          {/* <Textbox textLabel={`LAST NAME`} required="" name="lName" id={`lName`} value={data[0].by}/>
            <Dropdown id={`gender`} name="gender" value={data.by} labelText={''} dropdownLabel={'GENDER'} options={data.by}/> */}
        </div>
      </div>
      {modalOpen ? (
        <>
          {/* <div class="modal-body"> */}

          <div className="modalBackground">
            <div
              className={`modalContainer ${
                errorNameCategory || errorRoleName || errorDescription
                  ? "modalContainerRoleError"
                  : ""
              }`}
            >
              <div className="add-role-modal-header d-flex justify-content-between">
                <div className="add-role-modal">
                  <b>Add Role</b>
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
                  <div className="mr-auto p-2 aligntextbox">
                    <Dropdown
                      id="callcentre"
                      name="callcentre"
                      value={nameCategory}
                      labelText=""
                      dropdownLabel="Call Center"
                      options={callCenterData}
                      onDropDownChange={(e) => {
                        setNameCategory(e.target.value);
                        setErrorNameCategory(isEmpty(e.target.value));
                      }}
                    />
                    {errorNameCategory ? (
                      <small className="text-danger font-weight-bold">
                        Please select call center
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="p-2 aligntextbox">
                    <Textbox
                      textLabel="Role Name"
                      required=""
                      name="Rolename"
                      id="Rolename"
                      value={rolename}
                      onChange={(e) => {
                        setRolename(e.target.value);
                        setErrorRoleName(isEmpty(e.target.value));
                      }}
                    />
                    {errorRoleName ? (
                      <small className="text-danger font-weight-bold">
                        Please Enter Role Name
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="mr-auto p-2 aligntextbox1">
                    <Textbox
                      textLabel="Description"
                      required=""
                      name="Description"
                      id="Description"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setErrorDescription(isEmpty(e.target.value));
                      }}
                    />
                    {errorDescription ? (
                      <small className="text-danger font-weight-bold">
                        Please enter description
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="modalContainerbody">
                <p className="access">Access</p>
                <div className="table1 table-responsive mx-2">
                  <div>{renderAddRoleTable()}</div>
                </div>
                <div className="d-flex mx-2">
                  <div className="addrolebtn">
                    <Button
                      styleClass="standardButton standardDarkButton"
                      text="Add Role"
                      onClick={() => {
                        addRole();
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
      {editModal ? (
        <div className="modalBackground">
          <div className="modalContainer">
            <div className="add-role-modal-header d-flex justify-content-between">
              <div className="add-role-modal">
                <b>Update Role</b>
              </div>
              <div className="titleCloseBtn flex-row-reverse">
                <img
                  className="table-close-icon"
                  src={Close}
                  onClick={() => setEditModal(false)}
                  alt="close"
                />
              </div>
            </div>
            <div className="title ">
              <div className="d-flex ">
                <div className="mr-auto p-2 aligntextbox">
                  <Dropdown
                    id="callcentre"
                    name="callcentre"
                    value={editnameCategory}
                    labelText=""
                    dropdownLabel="Call Center"
                    options={callCenterData}
                    onDropDownChange={(e) => {
                      setEditNameCategory(e.target.value);
                      setErrorEditNameCategory(isEmpty(e.target.value));
                    }}
                  />
                  {errorEditNameCategory ? (
                    <small className="text-danger font-weight-bold">
                      Please Select Call Center
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="p-2 aligntextbox">
                  <Textbox
                    textLabel="Role Name"
                    required=""
                    name="Rolename"
                    id="Rolename"
                    value={editrolename}
                    onChange={(e) => {
                      setEditRolename(e.target.value);
                      setErrorEditRoleName(isEmpty(e.target.value));
                    }}
                  />
                  {errorEditRoleName ? (
                    <small className="text-danger font-weight-bold">
                      Please enter role name
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="d-flex">
                <div className="mr-auto p-2 aligntextbox1">
                  <Textbox
                    textLabel="Description"
                    required=""
                    name="Description"
                    id="Description"
                    value={editdescription}
                    onChange={(e) => {
                      setEditDescription(e.target.value);
                      setErrorEditDescription(isEmpty(e.target.value));
                    }}
                  />
                  {errorEditDescription ? (
                    <small className="text-danger font-weight-bold">
                      Please Enter Description
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="modalContainerbody">
              <p className="access">Access</p>
              <div className="table1 table-responsive mx-2">
                <div>{renderEditRoleTable()}</div>
              </div>
              <div className="d-flex mx-2">
                <div className="addrolebtn">
                  <Button
                    styleClass="standardButton standardDarkButton"
                    text="Update Role"
                    onClick={() => {
                      UpdateRole();
                      setEditModal(false);
                    }}
                  />
                </div>
                <Button
                  styleClass="standardButton standardLightButton"
                  text="Cancel"
                  onClick={() => {
                    setEditModal(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
// RoleManagement.propTypes = {};
// export default RoleManagement;
