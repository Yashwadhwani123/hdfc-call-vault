import React, { useEffect, useState } from "react";
import axios from "axios";

// import Topnav from "../components/common/topnav";
// import Sidebar from "../components/common/sidebar";
// import "../stylesheets/callcentre.css";
import "../stylesheets/callcentre.css";
import "../stylesheets/common/modal.css";
import { toast } from "react-toastify";
import Button from "../components/common/button";
import SearchIcon from "../images/Search_image_white.png";
import Textbox from "../components/common/textbox";
import Close from "../images/close.svg";
import AtoZ from "../images/atoz.svg";
import ZtoA from "../images/ztoa.png";
// import ajax from '../utils/ajax';
import CONSTANTS from "../utils/constants";
import handle_error from "../utils/handle";
import Loader from "../components/common/loader";
import isEmpty from "../utils/isEmpty";
import "react-toastify/dist/ReactToastify.css";
import callCenterAjax from "../utils/callCenterAjax";
import encryptData from "../components/common/crypto";
import ReactPaginate from "react-paginate";

toast.configure();

let temp = localStorage.getItem("ENCRYPTED_DATA");
// console.log("temp", temp);
let PERMISSION = temp ? JSON.parse(encryptData(temp, "dec")) : {};
// const PERMISSION = JSON.parse(encryptData(localStorage.getItem("ENCRYPTED_DATA"),"dec"))

const CallCentre = () => {
 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextLimit, setNextLimit] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortAs, setSortAs] = useState("asc");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      getCallCentreData(sortAs,true);
    }
  };
 
  const handlePageClick = async (data) => {
    const selectedPage = data.selected;
    const newOffset = selectedPage * limit;

    setLoading(true);
  
    const response = await callCenterAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.CALL_CENTRE_GET}?userType=Admin&orderBY=${sortAs}&offset=${newOffset}&limit=${limit}&nameCategory=${query}`,

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
    


    const onNext = async () => {
      const newOffset = offset + limit;
    
      setLoading(true);
      const response = await callCenterAjax(
        CONSTANTS.API_METHODS.GET,
        `${CONSTANTS.API.CALL_CENTRE_GET}/${localStorage.getItem("USER_NAME")}/${localStorage.getItem("IS_ADMIN")}/${sortAs}/${limit}/${newOffset}`,
        {},
        { id: localStorage.getItem("USER_ID") },
        {}
      );
    
      if (response.status === CONSTANTS.STATUS.OK) {
        setData(response.data);
        setOffset(newOffset);
        setCurrentPage(currentPage + 1);
        setLoading(false);
      } else {
        setLoading(false);
        handle_error(response.status, response.message);
      }
    };
    
    const onPrevious = async () => {
      const newOffset = offset - limit < 0 ? 0 : offset - limit;
    
      setLoading(true);
      const response = await callCenterAjax(
        CONSTANTS.API_METHODS.GET,
        `${CONSTANTS.API.CALL_CENTRE_GET}/${localStorage.getItem("USER_NAME")}/${localStorage.getItem("IS_ADMIN")}/${sortAs}/${limit}/${newOffset}`,
        {},
        { id: localStorage.getItem("USER_ID") },
        {}
      );
    
      if (response.status === CONSTANTS.STATUS.OK) {
        setData(response.data);
        setOffset(newOffset);
        setCurrentPage(currentPage - 1);
        setLoading(false);
      } else {
        setLoading(false);
        handle_error(response.status, response.message);
      }
 };
  };
  const [callid, setCallid] = useState("");
  const [namefield, setNameField] = useState("");
  const [bucket, setBucket] = useState("");
  const [errorid, setErrorId] = useState(false);
  const [errorname, setErrorName] = useState(false);
  const [errorbucket, setErrorBucket] = useState(false);
  const onIdChange = (e) => {
    setCallid(e.target.value);
    setErrorId(isEmpty(e.target.value));
  };
  const resetFields = () => {
    setNameField("");
    setErrorName(false);
  };
  const onNameChange = (e) => {
    setNameField(e.target.value);
    setErrorName(isEmpty(e.target.value));
  };
  const onBucketChange = (e) => {
    setBucket(e.target.value);
    setErrorBucket(isEmpty(e.target.value));
  };
   // const handleInput = () => {
  // };  
  const isValid = () => {
    if (isEmpty(namefield)) {
      return false;
    }
    return true;
  };

  const onSortChange = () => {
    const sortAsNew = sortAs === "asc" ? "desc" : "asc";
    // console.log('sortAsNew >>>>>>>>>',sortAsNew );
    setSortAs(sortAsNew);   
    getCallCentreData(sortAsNew);
  };

   // const body = {
  //   callCenterID: callid,
  //   nameCategory: namefield,
  //   sourceS3BuildPath: bucket,
  //   createdBy: "Super Admin",
  // };
  // GET REQUEST
  const getCallCentreData = async (customSortAs,resetOffset = false) => {
    setLoading(true);
    const newOffset = resetOffset ? 0 : offset;
    const response = await callCenterAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.CALL_CENTRE_GET}?userType=Admin&orderBY=${customSortAs}&offset=${newOffset}&limit=${limit}&nameCategory=${query}`,

      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response?.data);
      setCount(response?.data);
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

  // const getSortCallCentreData = async (param) => {
  //   setSortAs(sortAs === "desc" ? "asc" : "desc");
  //   setLoading(true);
  //   const response = await callCenterAjax(
  //     CONSTANTS.API_METHODS.GET,
  //     `${CONSTANTS.API.CALL_CENTRE_GET}/${param}/${limit}/${offset}`,
  //     {},
  //     { id: localStorage.getItem("USER_ID") },
  //     {}
  //   );
  //   if (response.status === CONSTANTS.STATUS.OK) {
  //     setData(response.data);
  //     setCount(response.totalCount);
  //     const totalPages = Math.ceil(response.totalCount / limit);
  //     setTotalPage(totalPages);
  //     setNextLimit(totalPages === currentPage);
  //     setLoading(false);
  //   } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
  //     setData([]);
  //     setLoading(false);
  //     setCount(0);
  //     setTotalPage(0);
  //     setCurrentPage(0);
  //     setNextLimit(false);
  //   } else {
  //     setData([]);
  //     setLoading(false);
  //     setCount(0);
  //     setTotalPage(0);
  //     setCurrentPage(0);
  //     setNextLimit(false);
  //     handle_error(response.status, response.message);
  //   }
  // };
  // const body = {
  //     callCenterID: 'formdata.callid',
  //     nameCategory: 'formdata.namefield',
  //     sourceS3BuildPath: 'formdata.bucket',
  //     createdBy: 'Super Admin',
  // };
  // POST REQUEST
  const addCallCentreData = async () => {
    if (isValid()) {
      const body = {
         // callCenterID: callid,
        nameCategory: namefield,
        // sourceS3BuildPath: bucket,
        // createdBy: 'Super Admin',
      };
      const response = await callCenterAjax(
        CONSTANTS.API_METHODS.POST,
        CONSTANTS.API.CALL_CENTRE_POST,
        {},
        { id: localStorage.getItem("USER_ID") },
        body
      );
      if (response.status === CONSTANTS.STATUS.CREATED) {
        setModalOpen(false);
        getCallCentreData();
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
      } else if (response.status === CONSTANTS.STATUS.OK) {
        toast.info(response.message, {
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
      // setErrorId(isEmpty(callid));
      setErrorName(isEmpty(namefield));
      setErrorBucket(isEmpty(bucket));
    }
  };
  useEffect(() => {
    getCallCentreData(sortAs);
  }, [Button]);
  const [modalOpen, setModalOpen] = useState(false);
  const renderTable = () => (
    <>
      <table className="table table-bordered">
        <thead className="tablehead">
          <tr>
            <th className="table-head" scope="col">
              Call Center ID
            </th>
            <th className="table-head" scope="col">
              Call Center Name / Category
            </th>
            <th className="table-head" scope="col">
              Source S3 Bucket
            </th>
          </tr>
        </thead>
        <tbody className="table_body">{count !== 0 && renderTableRows()}</tbody>
      </table>
      {loading === false && count === 0 && (
        <div className="text-center">No data found</div>
      )}
    </>
  );
  const renderTableRows = () => {
    if (data?.length > 0) {
      return data?.map((dataItem, index) => (
        <tr>
          <td className="table-data-small">
            <div className="table_size">{dataItem.callCenterID}</div>
          </td>
          <td className="table-data">
            <div className="table_size">{dataItem.nameCategory}</div>
          </td>
          <td className="table-data">
            <div className="table_size">{dataItem.sourceS3BuildPath}</div>
          </td>
        </tr>
      ));
    }
  };
  return (
    <>
      <div className={`content ${loading || modalOpen ? "loading-blur" : ""}`}>
        {loading && <Loader />}
        {/* <div className="content">  */}
        <div className="centre">
          <div className="headerline">
            <div className="headertag">
              <b>Call Centers</b>
            </div>
            <div className="button-group">
              <div className="search-container-callcenter">
                <input
                  type="text"
                  placeholder="Call  Center Name/Category "
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleEnterKey}
                />
                <div className="bgcolor_serchIcon" onClick={()=>getCallCentreData(sortAs,true)}>
                  <img
                    className="search-icon"
                    src={SearchIcon}
                    alt="Search"
                    title="Enter For Search"
                  />
                </div>
              </div>

              {/* <div onClick={() => onSortChange()} className="atoz">
                <img src={sortAs === "desc" ? AtoZ : ZtoA} />
              </div> */}

              <div onClick={()=>onSortChange()} className="atoz">
                <img src={sortAs === "asc" ? AtoZ : ZtoA} />
              </div>

              {/* {desc ?  <div onClick={()=>(onSortChange())} className="atoz"><img src={ZtoA}/></div> } */}
              <div>
                {PERMISSION.callCenter && (
                  <>
                    {PERMISSION.callCenter.add && (
                      <Button
                        text="Add Call Center"
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
          
          {/* <div className="table-responsive"> commented for UI alignment chnges  */}
          <div>
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
                        pageLinkClassName={'pageNumberLink'}
                        forcePage={currentPage - 1} 
                      />
                                            
                      
                // <nav aria-label="...">
                //   <ul className="pagination d-flex justify-content-end">
                //     <li className="page-item pointer">
                //       <span
                //         className={`page-link previousPagination text-center noBgColor pointer ${
                //           offset !== 0 ? "text-dark" : ""
                //         }`}
                //         style={{ pointerEvents: offset === 0 ? "none" : "" }}
                //         onClick={onPrevious}
                //       >
                //         Previous
                //       </span>
                //     </li>
                //     <li className="page-item pointer">
                //       <span className="page-link noBgColor pointer text-dark">
                //         {`${currentPage} of ${totalPage}`}
                //       </span>
                //     </li>
                //     <li className="page-item pointer">
                //       <span
                //         className={`page-link text-center nextPagination noBgColor pointer ${
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
                
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalOpen ? (
        <div className="modalBackground">
          <div
            className={`modalContainerCallCentre ${
              errorid || errorname || errorbucket
                ? "modalContainerCallCentreError"
                : ""
            }`}
          >
            <div className="add-role-modal-header d-flex justify-content-between">
              <div className="add-role-modal mb-2">
                <b>Add Call Center</b>
              </div>
              <div className="titleCloseBtn flex-row-reverse mb-2">
                <img
                  alt=""
                  className="table-close-icon"
                  src={Close}
                  onClick={() => setModalOpen(false)}
                />
              </div>
            </div>
            <form>
              <div className="title ">
                <div className="d-flex ">
                   {/* <div className="mr-auto p-2 aligntextbox">
                    <Textbox
                      textLabel="Call Center ID"
                      required=""
                      // name="callcentreid"
                      id="callcentreid"
                      onChange={onIdChange}
                      value={callid}
                    />
                    {errorid ? (
                      <small className="text-danger font-weight-bold">
                        Please enter caller id
                      </small>
                    ) : (
                      ""
                    )}
                  </div> */}
                  <div className="p-2 aligntextbox">
                    <Textbox
                      textLabel="Call Center Name / Category"
                      required=""
                      // name="name"
                      id="name"
                      // value={formdata.namefield}
                      // value={data[0].name}
                      onChange={onNameChange}
                      value={namefield}
                    />
                    {errorname ? (
                      <small className="text-danger font-weight-bold">
                        Please enter Call Center Name/Category
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                  {/* <div className="mr-auto p-2 aligntextbox1 mb-2">
                  <Textbox
                    textLabel="Source S3 Bucket Path"
                    required=""
                    name="source"
                    id="source"
                    // value={formdata.bucket}
                    // value={data[0].bucket}
                    onChange={onBucketChange}
                    value={bucket}
                  />
                  {errorbucket ? (
                    <small className="text-danger font-weight-bold">
                      Please provide S3/bucket Path
                    </small>
                  ) : (
                    ""
                  )}
                </div> */}
                {/* <div className="d-flex">

                </div> */}
              </div>
            </form>
            {/* <div className="modalContainerbody"> */}
            <div className="d-flex mx-2 mt-4">
              <div className="addrolebtn">
                <Button
                  styleClass="standardButton standardDarkButton"
                  text="Add"
                  onClick={() => {
                    addCallCentreData();
                  }}
                />
              </div>
              <Button
                styleClass="standardButton standardLightButton"
                text="Cancel"
                onClick={() => {
                  setModalOpen(false);
                  resetFields();
                }}
              />
            </div>
          </div>
        </div>
      ) : (
           // </div>
        ""
      )}
    </>
  );
};
export default CallCentre;
