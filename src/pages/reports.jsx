import React, { useEffect, useState } from "react";
import "../stylesheets/reports.css";
import DatePicker from "react-datepicker";
import Button from "../components/common/button";
// import Textbox from '../components/common/textbox';
// import Dropdown from '../components/common/dropdown';
import RegularDropdown from "../components/common/regulardropdown";
import moment from "moment";
import CONSTANTS from "../utils/constants";
import callRecordAjax from "../utils/callRecordAjax";
import handle_error from "../utils/handle";
import SearchIcon from "../images/Search_image_white.png";
import searchIcon from './../images/search-3-64.png';
import axios from "axios";
import ReactPaginate from 'react-paginate';

// import Edit from '../images/edit.svg';
// import Delete from '../images/delete.svg';
import Filter from "../images/Group 107454.svg";
// import Close from '../images/close.svg';
import calenderImage from "../images/Icon metro-calendar.svg";
import "../stylesheets/common/date-picker.css";

import "react-datepicker/dist/react-datepicker.css";
import "../stylesheets/common/button.css";
import Upload from "./../images/Icon feather-upload.svg";
import ReportTextBox from "../components/common/reportTextbox";

const Reports = (props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // const [startDate, setStartDate] = useState(
  //   moment().subtract(15, "days").toDate()
  // );
  // const [endDate, setEndDate] = useState(moment().toDate());
  // console.log('enddate>>>>>>>>>..',endDate)
 
  // const currentDate = new Date(); 
  
  // const next15Days = new Date(currentDate);
  // next15Days.setDate(next15Days.getDate() - 15); 
  // console.log('currentDate>>>>>',next15Days);
  // const [startDate, setStartDate] = useState(next15Days);
  // const [endDate, setEndDate] = useState( currentDate);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortAs, setSortAs] = useState("desc");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextLimit, setNextLimit] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [count, setCount] = useState(0);
  const [userid, setUserid] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [businessGroup, setBusinessGroup] = useState(null);
  const [addMetaFileName, setAddMetaFileName] = useState("");
  const [metaFileName, setMetaFileName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(""); // State to store status for the modal
  const [searchValue, setSearchValue] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [query, setQuery] = useState("");
  const [maxEndDate, setMaxEndDate] = useState(moment().add(15, 'days').toDate());
  const [businessDrop, setBusinessDrop] = useState(false);
  const [clearState, setClearState] = useState(false);

  function FetchURL(query, startD, endD) {
    if (query && startD && endD) {
      return `/admin/null/${query}/3/${startD}/${endD}/10/0/createdAt/desc`;
    } else if (startD && endD) {
      return `/admin/null/null/3/${startD}/${endD}/10/0/createdAt/desc`;
    } else if (query) {
      return `/admin/null/${query}/3/null/null/10/0/createdAt/desc`;
    } else {
      return `/admin/null/null/3/null/null/10/0/createdAt/desc`;
    }
  }
  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      SearchOnMetaFileName(e.target.value);
    }
  };

  const searchOnClick = () => {
    SearchOnMetaFileName(metaFileName);
  };
  // const handleStartDateChange = (date) => {
  //   if (date) {
  //     setStartDate(date);
  //     const newMaxEndDate = moment(date).add(15, 'days').toDate();
  //     setMaxEndDate(newMaxEndDate);
  //     if (endDate && endDate > newMaxEndDate) {
  //       setEndDate(newMaxEndDate);
  //     }
  //     setBusinessDrop(false);
  //   }
  // };
  const setStartDateFun = (e) => {
    setStartDate(e);
    setEndDate(null);
    // getUserData();
  };
  const setEndDateFun = (e) => {
    console.log("end date", e);
    setEndDate(e);
    getSearchRecords(startDate, e);
    setBusinessDrop(false);
  };

  const onClearDateClick = (e) => {
    setStartDate(null);
    setEndDate(null);
    getSearchRecords(null);
    // const StartDate = moment().subtract(15, "days").toDate();
    // const EndDate = moment().toDate();
    // setStartDate(StartDate);
    // setEndDate(EndDate);
    // getSearchRecords(StartDate, EndDate);
  };
  const handlePageClick = async (selected) => {
    console.log('selected report>>>>>.',selected);
    const newOffset = selected.selected * limit;
    console.log('newOffset report>>',newOffset)
    setOffset(newOffset);
    setCurrentPage(selected.selected + 1);
  
    try {
      setLoading(true);
      const calculatedOffset = (selected.selected) * limit;
      const metaName = metaFileName ? metaFileName : null;
      const startD = startDate ? moment(startDate)?.format("YYYY-MM-DD") : null;
      const endD = endDate ? moment(endDate)?.format("YYYY-MM-DD") : null;
  
      const response = await callRecordAjax(
        CONSTANTS.API_METHODS.GET,
        `${CONSTANTS.API.GET_RECORDS}/${localStorage.getItem(
          "IS_ADMIN"
        )}/${businessGroup}/${metaName}/${localStorage.getItem(
          "USER_ID"
        )}/${startD}/${endD}/${limit}/${calculatedOffset}/${sortBy}/${sortAs}`,
        {},
        { id: localStorage.getItem("USER_ID") },
        {}
      );
  
      if (response.status === CONSTANTS.STATUS.OK) {
        setData([...response?.data]);
        setCount(response?.totalCount);
        const totalPages = Math.ceil(response?.totalCount / limit);
        setTotalPage(totalPages);
        setNextLimit(totalPages === currentPage);
      } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
        setData([]);
        setCount(0);
        setTotalPage(0);
        setCurrentPage(0);
        setNextLimit(false);
      } else {
        setData([]);
        setCount(0);
        setTotalPage(0);
        setCurrentPage(0);
        setNextLimit(false);
        handle_error(response.status, response.message);
      }
    } finally {
      setLoading(false);
    }
  }; 
  const onNext = async () => {
    setLoading(true);
    setOffset(offset + limit);
    let metaName = metaFileName ? metaFileName : null;
    const startD = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const endD = endDate ? moment(endDate).format("YYYY-MM-DD") : null;

    setCurrentPage(currentPage + 1);
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_RECORDS}/${localStorage.getItem(
        "IS_ADMIN"
      )}/${businessGroup}/${metaName}/${localStorage.getItem(
        "USER_ID"
      )}/${startD}/${endD}/${limit}/${offset + limit}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
      setNextLimit(totalPages === currentPage);
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
    let metaName = metaFileName ? metaFileName : null;
    const startD = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const endD = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_RECORDS}/${localStorage.getItem(
        "IS_ADMIN"
      )}/${businessGroup}/${metaName}/${localStorage.getItem(
        "USER_ID"
      )}/${startD}/${endD}/${limit}/${offset - limit}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
      setNextLimit(totalPages === currentPage);
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

  const setSort = (e) => {
    setSortBy(e);
    setSortAs(sortAs === "desc" ? "asc" : "desc");
    getRecords();
  };

  // const businessGroup = "NA";
  // const columnName = {}

  const getRecords = async () => {
    let metaName = metaFileName ? metaFileName : null;
    const startD = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const endD = endDate
      ? moment(endDate).format("YYYY-MM-DD")
      : null;
      console.log('endD>>>>.......',endD)
      const fetchURL = FetchURL(query, startD, endD);
      const response = await callRecordAjax(
        CONSTANTS.API_METHODS.GET,
        `${CONSTANTS.API.GET_RECORDS}/${localStorage.getItem(
          "IS_ADMIN"
        )}/${businessGroup}/${metaName}/${localStorage.getItem(
          "USER_ID"
        )}/${startD}/${endD}/${limit}/${offset}/${sortBy}/${sortAs}`,
        {},
        { id: localStorage.getItem("USER_ID") },
        {}
      );
  
      if (response.status === CONSTANTS.STATUS.OK) {
        setData([...response?.data]);
        setLoading(false);
        setCount(response?.totalCount);
        const totalPages = Math.ceil(response?.totalCount / limit);
        setTotalPage(totalPages);
        setNextLimit(totalPages === currentPage);
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

  const checkStatus = async (metaFileName) => {
    let metaName = metaFileName ? metaFileName : null;
    let fetchURL = `?metaFileName=${metaName}&limit=1&offset=0`;
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.CHECK_METAFILE_STATSU}${fetchURL}`,
      
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    let data = response?.data;

    let statusofFile = data[0]?.status;
    return setModalStatus(statusofFile);
  };

  const getSearchRecords = async (startDate, endDate) => {
    let metaName = query ? query : null;
    const startD = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const endD = endDate ? moment(endDate).format("YYYY-MM-DD") : null;

    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_RECORDS}/${localStorage.getItem(
        "IS_ADMIN"
      )}/${businessGroup}/${metaName}/${localStorage.getItem(
        "USER_ID"
      )}/${startD}/${endD}/${limit}/${offset}/${sortBy}/${sortAs}`,
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
    }
  };

  const downloadReports = async () => {
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.DOWNLOAD_REPORT}/${localStorage.getItem("USER_ID")}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    ).then(async (res) => {
      console.log("downloadReports", res);
      window.open(res.data[0]);
    });
  };

  function startDownload(url) {
    const element = document.createElement("a");
    const file = new Blob([url], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    // let link = document.createElement("a");
    // link.href = url;
    // link.download = "log.txt";
    // link.click();
  }
  const TextFile = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById("message").value], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const SearchOnMetaFileName = async (query) => {
    setMetaFileName(query);
    let metaName = query ? query : null;
    const startD = startDate ? moment(startDate).format("YYYY-MM-DD") : null;

    const endD = endDate
      ? moment(endDate).add(1, "days").format("YYYY-MM-DD")
      : null;

    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_RECORDS}/${localStorage.getItem(
        "IS_ADMIN"
      )}/${businessGroup}/${metaName}/${localStorage.getItem(
        "USER_ID"
      )}/${startD}/${endD}/${limit}/${offset}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData([...response?.data]);
      setLoading(false);
      setCount(response?.totalCount);
      const totalPages = Math.ceil(response?.totalCount / limit);
      setTotalPage(totalPages);
      setNextLimit(totalPages === currentPage);
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

  const clearFilters = () => {
    setMetaFileName(null);
    // setApplicationNumbers(null  );
    // setPolicyNumbers(null);
    // setAddPolicy("");
    setAddMetaFileName("");
    // setAddApplicationNo("");

    setClearState(true)
  };

  useEffect(() => {
    getRecords("createdAt");
  }, []);

  useEffect(() => {
    if(clearState){
      getRecords("createdAt");
    }
  }, [clearState]);

  // useEffect(() => {
  //   const maxEndDate = moment(startDate).add(15, "days").toDate();
  //   if (endDate > maxEndDate) {
  //     setEndDate(maxEndDate);
  //   }
  // }, [startDate, endDate]);

  const renderTable = () => (
    <>
      <table className="table table-bordered">
        <thead className="tablehead">
          <tr>
            <th className="table-head" scope="col">
              Meta File Name
            </th>
            <th className="table-head" scope="col">
              Created At
            </th>
            <th className="table-head" scope="col">
              Business Name
            </th>
            <th className="table-head" scope="col">
              Business Group
            </th>
            <th className="table-head" scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </>
  );
  // Modal component with custom styles
  const StatusModal = ({ isOpen, onClose, status }) => {
    return (
      <div
        className={`modal ${isOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Status Details</h5>
            </div>
            <div className="modal-body">
              <p className="status-text">Status: {status}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTableRows = () => {
    if (data.length > 0) {
      return data.map((item, index) => (
        <tr>
          {/* <td className="table-data">{item.userId}</td> */}
          {/* <td className="table-data">{item.recordingFileName}</td> */}
          <td className="table-data">{item.metaFileName}</td>
          {/* <td className="table-data">{item.firstName}</td> */}
          <td className="table-data">{item?.createdAt?.substring(0, 10)}</td>
          <td className="table-data">{item.groupName}</td>
          <td className="table-data">{item.businessGroup}</td>
          {/* <td className="table-data">{item.status}</td> */}
          <td className="table-data last_row">
            <button
              type="button"
              className="btn tabelButton"
              onClick={() => {
                checkStatus(item.metaFileName); // Set the status for the modal
                setIsModalOpen(true); // Open the modal
              }}
            >
              Check Status
            </button>
            <a download onClick={() => downloadRecord(item)}>
              <img className="ml-1 download_img" src={Upload} alt="Download" />
            </a>
          </td>
        </tr>
      ));
    }
  };

  const downloadRecord = async (item) => {
    console.log("DownloadRecord", item);
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.DOWNLOAD_REPORT}/${localStorage.getItem(
        "IS_ADMIN"
      )}/${localStorage.getItem("USER_ID")}`,
      {},
      { id: localStorage.getItem("USER_ID"), metaFileName: item.metaFileName },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      console.log("DownloadRecord 123", response);
      window.open(response.data[0]);
      // startDownload(response.data[0])
      // setLink(response.data[0])
    }
  };
  return (
    <>
      <div className="content">
        <div className="centre">
          <div className="headerline">
            <div className="headertag">
              <b>Reports</b>
            </div>
            <div className="filterContainer  "></div>
            <div className="header-buttons">
              {/* <div className="reportDropdown">
                {" "}
                <RegularDropdown
                  id={`selectcategory`}
                  name="All"
                  value={data.by}
                  labelText={""}
                  // dropdownLabel={"Call Centre"}
                  styleClass={'all-border'}
                  options={data.by}
                />
              </div> */}
              {/* 
              <div className="search-container">
                <input
                  className="forplaceholder"
                  type="text"
                  placeholder="Metafile Name"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleEnterKey}
                />
                <div className="bgcolor_serchIcon"  onClick={getRecords}>
                  <img
                    className="search-icon"
                    src={SearchIcon}
                    alt="Search"
                    title="Enter For Search"
                  />
                </div>
              </div> */}

              <div className="search-container">
                <input
                  className="forplaceholder"
                  type="text"
                  placeholder="Metafile Name"
                  value={addMetaFileName}
                  onChange={(e) => {
                    setAddMetaFileName(e.target.value);
                    setMetaFileName(e.target.value);
                    // SearchOnMetaFileName(e.target.value);
                  }}
                  onKeyDown={handleEnterKey}
                />
                
              </div>

              <div
                className=" d-flex mr-2 calendar"
                style={{
                  border: "1px solid #005E9C",
                  borderRadius: "5px",
                  padding: "4px",
                  height: "2.5em",
                }}
              >
                <DatePicker
                  className="border border-0  coloe datePicker-Input text-dark"
                  placeholderText="Start Date"
                  selected={startDate}
                  // onChange={handleStartDateChange}
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
                className="d-flex calendar"
                style={{
                  border: "1px solid #005E9C",
                  borderRadius: "5px",
                  padding: "4px",
                  height: "2.5em",
                }}
              >
                <DatePicker
                  className="border border-0 coloe datePicker-Input text-dark"
                  placeholderText="End Date"
                  selected={endDate}
                  onChange={(date) => setEndDateFun(date)}
                  // timeInputLabel="Time:"
                  dateFormat="dd/MM/yyyy"
                  // showTimeInput
                  disabled={startDate === ""}
                  minDate={startDate}
                    // maxDate={maxEndDate}
                  maxDate={new Date()}
                  title={
                    startDate === "" ? "Please select start date first." : ""
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
              <div className="button-set">
                <Button
                  styleClass="standardButton standardLightButton clear-date ml-3"
                  text="Reset Date"
                  onClick={() => {
                    onClearDateClick();
                  }}
                />
                
                
                {/* <Button
                                styleClass="standardButton standardLightButton clear-date"
                                text="Clear Date"
                            /> */}
                {/* <Button
                  styleClass="standardButton standardLightButton"
                  text="Download"
                  onClick={() => {
                    downloadReports();
                  }}
                /> */}
              </div>
              <button className="ClearButton" onClick={clearFilters} style={{ color: 'white', marginRight: '10px' }}>
    Clear
</button>
              <button className="SearchIcon" onClick={searchOnClick}>
              <img src={searchIcon} alt="Search" height="20" width="20" />
            </button>
              
            </div>
          </div>
          <div className="table1 table-responsive">
            <div className="ctc-table">{renderTable()}</div>
          </div>
          <div  className="pagination-container  mt-2">
          {loading === false && count !== 0 && (
            <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={totalPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            nextLinkClassName={'nextButtonLink'}
            previousLinkClassNameLinkClassName={'previousButtonLink'}
            forcePage={currentPage - 1} 
           
          />
            // <nav aria-label="..." style={{ marginTop: "20px" }}>
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
        <StatusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          status={modalStatus}
        />
      </div>
    </>
  );
};

export default Reports;
