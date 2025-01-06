import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Dropdown from '../components/common/download_call_dropdown';
import Textbox from '../components/common/download_call_textbox';
import Loader from '../components/common/loader';
import calenderImage from '../images/Icon metro-calendar.png';
import '../stylesheets/download_call_records.css';
import callRecordAjax from '../utils/callRecordAjax';
import CONSTANTS from '../utils/constants';
import handle_error from '../utils/handle';
import userAjax from '../utils/userAjax';
import Play from './../images/Icon ionic-ios-play-circle.svg';
import searchIcon from './../images/search-3-64.png';
import ReactPaginate from 'react-paginate';

const Download_call_records = ({ fileRecordingPath }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const currentDate = new Date(); 
  const next15Days = new Date(currentDate);
  next15Days.setDate(next15Days.getDate() - 10);

  const [startDate, setStartDate] = useState(next15Days);
  const [endDate, setEndDate] = useState( currentDate);
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [sortBy, setSortBy] = useState('callStartDate');
  const [sortAs, setSortAs] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [nextLimit, setNextLimit] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [path, setPath] = useState('');
  const [businesscategory, setBusinessCategory] = useState('');
  const [addbusinesscategory, setAddBusinessCategory] = useState(null);
  const [addapplication, setAddApplication] = useState('');
  const [applicationnumber, setApplicationNumber] = useState(null);
  const [addPolicy, setAddPolicy] = useState('');
  const [policynumbers, setPolicyNumbers] = useState(null);
  const [addMobile, setAddMobile] = useState('');
  const [mobileno, setMobileNo] = useState(0);
  const [errorValidMobile, setErrorValidMobile] = useState(false);
  const [errorValidApplication, setErrorValidApplication] = useState(false);
  const [errorValidPolicy, setErrorValidPoicy] = useState(false);
  const [businessDrop, setBusinessDrop] = useState(false);
  const [bucketname, setBucketName] = useState('');
  const [link, setLink] = useState('');
  const [callCenterDDData, setCallCenterDDData] = useState([]);
  const [callCenter, setCallCenter] = useState('');
  const [newCallCenter, setNewCallCenter] = useState('');
  const [clicked, setClicked] = useState(false);
  const [clearState, setClearState] = useState(false);
  const [maxEndDate, setMaxEndDate] = useState(moment().add(15, 'days').toDate());
  const searchOnClick = async() => {
     // setClicked(true);
    setLoading(true);
    setClearState(false)
    try {
      if (applicationnumber) {
        await SearchOnApplication(applicationnumber);
      } else if (policynumbers) {
        await SearchOnPolicy(policynumbers);
      } else if (mobileno) {
        await SearchOnMobile(mobileno);
      } else{
        await getPhoneCallRecords(0)
      }
    } catch(error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const setStartDateFun = (e) => {
    setStartDate(e);
    setEndDate(null);
    setBusinessDrop(false);
  };
  const setEndDateFun = (e) => {
    setEndDate(e);
    getSearchPhoneCallRecords(startDate, e);
    setBusinessDrop(false);
  };

  const onClearDateClick = (e) => {
    setStartDate(null);
    setEndDate(null);
    setMobileNo(0);
    setAddMobile('');
    setAddBusinessCategory(null);
    getSearchPhoneCallRecords(null, null);
    setBusinessDrop(false);
  };
  const handlePageClick = async (selected) => {
    const newPage = selected.selected + 1;
  const newOffset = (newPage - 1) * limit;
  setLoading(true);
  // setOffset(newOffset);
    setLoading(true);
  
    const startD = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const endD = endDate ? moment(endDate).add(1, 'days').format('YYYY-MM-DD') : null;
  
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_PHONECALL_RECORDS}/${mobileno || 0}/${policynumbers || null}/${applicationnumber || null}/${localStorage.getItem('IS_ADMIN')}/${addbusinesscategory || null}/${localStorage.getItem(
        'USER_ID'
      )}/${startD}/${endD}/${limit}/${newOffset}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
  
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      setCurrentPage(newPage);
      setLoading(false);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setData([]);
      setLoading(false);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
      handle_error(response.status, response.message);
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
  const onNext = async () => {
    setLoading(true);
    setOffset(offset + limit);
    const startD = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const endD = endDate ? moment(endDate).add(1, 'days').format('YYYY-MM-DD') : null;
    // const userName = localStorage.getItem("IS_ADMIN") === "admin" ? "admin" : "user"
    // const getbusinesscategory = addbusinesscategory !== '' ? addbusinesscategory : callCenterDDData
    // let callResponse = await userAjax(CONSTANTS.API_METHODS.GET, `${CONSTANTS.API.GET_CATEGORY_DD}/${localStorage.getItem('IS_ADMIN')}/${localStorage.getItem('USER_ID')}`,{},{id: localStorage.getItem("USER_ID")},{},);
    // let callData = callResponse.data.map((val) => ({name: val.category }));
    // const getbusinesscategory = addbusinesscategory !== null ? addbusinesscategory : callData[0].name

    setCurrentPage(currentPage + 1);
    const response1 = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_PHONECALL_RECORDS}/${mobileno || 0}/${localStorage.getItem('IS_ADMIN')}/${addbusinesscategory || null}/${localStorage.getItem('USER_ID')}/${startD}/${endD}/${limit}/${
        offset + limit
      }/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
    console.log('resp 1', response1);
    if (response1.status === CONSTANTS.STATUS.OK) {
      setData(response1.data);
      setCount(response1.totalCount);
      const totalPages = Math.ceil(response1.totalCount / limit);
      setNextLimit(totalPages === currentPage + 1);
      setLoading(false);
    } else if (response1.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
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
      handle_error(response1.status, response1.message);
    }
  };

  const onPrevious = async () => {
    setLoading(true);
    setOffset(offset - limit);
    setCurrentPage(currentPage - 1);
    const startD = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const endD = endDate ? moment(endDate).add(1, 'days').format('YYYY-MM-DD') : null;
    const userName = localStorage.getItem('IS_ADMIN') === 'admin' ? 'admin' : 'user';
    const response1 = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_PHONECALL_RECORDS}/${mobileno || 0}/${localStorage.getItem('IS_ADMIN')}/${addbusinesscategory || null}/${localStorage.getItem('USER_ID')}/${startD}/${endD}/${limit}/${
        offset - limit
      }/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );

    if (response1.status === CONSTANTS.STATUS.OK) {
      setData(response1.data);
      setCount(response1.totalCount);
      const totalPages = Math.ceil(response1.totalCount / limit);
      setNextLimit(totalPages === currentPage);
      setLoading(false);
    } else if (response1.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
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
      handle_error(response1.status, response1.message);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const setSort = (e) => {
    setSortBy(e);
    setSortAs(sortAs === 'desc' ? 'asc' : 'desc');
    getPhoneCallRecords();
  };

  const getPhoneCallRecords = async (e) => {
    const startD = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const endD = endDate ? moment(endDate).add(1, 'days').format('YYYY-MM-DD') : null;
    setLoading(true);
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_PHONECALL_RECORDS}/${mobileno || 0}/${policynumbers || null}/${applicationnumber || null}/${localStorage.getItem('IS_ADMIN')}/${addbusinesscategory || null}/${localStorage.getItem(
        'USER_ID'
      )}/${startD}/${endD}/${limit}/${offset}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
    // console.log('response>>>>>>', response);
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
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

  // const isValid = () => {
  //   if(!isEmpty(addMobile)){
  //     const mobilePattern = new RegExp('[0-9]{10}');
  //     const validMobile = mobilePattern.test(String(addMobile));
  //     if(validMobile == false){
  //         setErrorValidMobile(true);
  //         return false
  //     }
  //     else{
  //         setErrorValidMobile(false);
  //     }
  // }
  //     if (isEmpty(addMobile) || addMobile==='') {
  //       return false;
  //     }
  //     return true;
  // };
  // const handleStartDateChange = (date) => {
  //   if (date) {
  //     setStartDate(date);
  //     const newMaxEndDate = moment(date).add(10, 'days').toDate();
  //     setMaxEndDate(newMaxEndDate);
  //     if (endDate && endDate > newMaxEndDate) {
  //       setEndDate(newMaxEndDate);
  //     }
  //     setBusinessDrop(false);
  //   }
  // };
  const handleStartDateChange = (date) => {
    if (date) {
      setStartDate(date);
      const newEndDate = moment(date).add(15, 'days').toDate();
      const validEndDate = newEndDate > maxEndDate ? maxEndDate : newEndDate;
      setEndDate(validEndDate);
      setMaxEndDate(moment(date).add(15, 'days').toDate());
      setBusinessDrop(false);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const getSearchPhoneCallRecords = async (start, end) => {
    setLoading(true);
    console.log('businesscategory', localStorage.getItem('IS_ADMIN'));
    console.log('addbusinesscategory', addbusinesscategory);
    const startD = start ? moment(start).format('YYYY-MM-DD') : null;
    const endD = end ? moment(end).format('YYYY-MM-DD') : null;
        // const category = localStorage.getItem("IS_ADMIN") == 'admin' ? null : businesscategory[0].name
    // console.log("category-------------",category);
    // let callResponse = await userAjax(CONSTANTS.API_METHODS.GET, `${CONSTANTS.API.GET_CATEGORY_DD}/${localStorage.getItem('IS_ADMIN')}/${localStorage.getItem('USER_ID')}`,{},{id: localStorage.getItem("USER_ID")},{},);
    // let callData = callResponse.data.map((val) => ({name: val.category }));
    // const getbusinesscategory =localStorage.getItem("IS_ADMIN") == 'admin' ? null : callData[0].name
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_PHONECALL_RECORDS}/${mobileno || 0}/${policynumbers || null}/${applicationnumber || null}/${localStorage.getItem('IS_ADMIN')}/${addbusinesscategory || null}/${localStorage.getItem(
        'USER_ID'
      )}/${startD}/${endD}/${limit}/${offset}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
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

  const DropdownValue = async (e) => {
    const startD = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const endD = endDate ? moment(endDate).add(1, 'days').format('YYYY-MM-DD') : null;
    setAddBusinessCategory(e.target.value);
    // const getbusinesscategory = e.target.value;
    console.log('e', e);
    const userName = localStorage.getItem('IS_ADMIN') === 'admin' ? 'admin' : 'user';
    const getbusinesscategory = e.target.value !== '' ? e.target.value : callCenter;
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_PHONECALL_RECORDS}/${mobileno || 0}/${policynumbers || null}/${applicationnumber || null}/${localStorage.getItem('IS_ADMIN')}/${getbusinesscategory || null}/${localStorage.getItem(
        'USER_ID'
      )}/${startD}/${endD}/${limit}/${offset}/${sortBy}/${sortAs}`,
      // `${
      //   CONSTANTS.API.GET_CALL_RECORDS}/${getbusinesscategory}/${limit}/${offset}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
       // `${
      //   CONSTANTS.API.GET_NEW_CALL_RECORD}/${getbusinesscategory}/${userName}/${limit}/${offset}`,
      // {},
      // { id: localStorage.getItem("USER_ID") },
      // {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      console.log('response --------------', response);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
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
      // setMobileNo(0);
      setCount(0);
      setTotalPage(0);
      setCurrentPage(0);
      setNextLimit(false);
      // handle_error(response.status, response.message);
    }
  };
  const SearchOnApplication= async (value) => {
    console.log('test----------', value);

    const startD = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const endD = endDate ? moment(endDate).add(1, 'days').format('YYYY-MM-DD') : null;
    setApplicationNumber(value);
    // const getApplicationNo = value || 0;
    // let callResponse = await userAjax(CONSTANTS.API_METHODS.GET, `${CONSTANTS.API.GET_CATEGORY_DD}/${localStorage.getItem('IS_ADMIN')}/${localStorage.getItem('USER_ID')}`,{},{id: localStorage.getItem("USER_ID")},{},);
    // let callData = callResponse.data.map((val) => ({name: val.category }));
    // const getbusinesscategory = addbusinesscategory !== null ? addbusinesscategory : callData[0].name
    // if (value !== '') {
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_PHONECALL_RECORDS}/${0}/${null}/${value || null}/${localStorage.getItem('IS_ADMIN')}/${addbusinesscategory || null}/${localStorage.getItem(
        'USER_ID'
      )}/${startD}/${endD}/${limit}/${offset}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
    console.log('response>>>>>>>>>', response);
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
      setTotalPage(totalPages);
      setNextLimit(totalPages === currentPage);
      setLoading(false);
      setMobileNo(0);
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
      handle_error(response.status);
    }
    // }
  };
  const SearchOnPolicy= async (value) => {
    console.log('test----------', value);

    const startD = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const endD = endDate ? moment(endDate).add(1, 'days').format('YYYY-MM-DD') : null;
    setPolicyNumbers(value);
    const getPolicyNo = value !== '' ? value : 0;
    // let callResponse = await userAjax(CONSTANTS.API_METHODS.GET, `${CONSTANTS.API.GET_CATEGORY_DD}/${localStorage.getItem('IS_ADMIN')}/${localStorage.getItem('USER_ID')}`,{},{id: localStorage.getItem("USER_ID")},{},);
    // let callData = callResponse.data.map((val) => ({name: val.category }));
    // const getbusinesscategory = addbusinesscategory !== null ? addbusinesscategory : callData[0].name
    // if (value !== '') {
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_PHONECALL_RECORDS}/${0}/${getPolicyNo}/${null}/${localStorage.getItem('IS_ADMIN')}/${addbusinesscategory}/${localStorage.getItem(
        'USER_ID'
      )}/${startD}/${endD}/${limit}/${offset}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
    console.log('response>>>>>>>>>', response);
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
      setTotalPage(totalPages);
      setNextLimit(totalPages === currentPage);
      setLoading(false);
      // setMobileNo(0);
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
      handle_error(response.status);
    }
    // }
  };
  const SearchOnMobile = async (value) => {
    console.log('testsasasa----------', value);

    const startD = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const endD = endDate ? moment(endDate).add(1, 'days').format('YYYY-MM-DD') : null;
    setMobileNo(value);
    const getMobileNo = value !== '' ? value : 0;
    console.log('getMobileNo>>>>>>....',getMobileNo)
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_PHONECALL_RECORDS}/${getMobileNo}/${null}/${null}/${localStorage.getItem('IS_ADMIN')}/${addbusinesscategory}/${localStorage.getItem(
        'USER_ID'
      )}/${startD}/${endD}/${limit}/${offset}/${sortBy}/${sortAs}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
    console.log('response>>>>>>>>>', response);
    if (response.status === CONSTANTS.STATUS.OK) {
      setData(response.data);
      setCount(response.totalCount);
      const totalPages = Math.ceil(response.totalCount / limit);
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
      handle_error(response.status);
    }
    // }
  };
  const clearFilters = () => {
    setPolicyNumbers(null);
    setMobileNo(0);
    setApplicationNumber(null);
    setAddPolicy('');
    setAddMobile('');
    setAddApplication('');

    setClearState(true)
  };
  const BusinessCategoryDropdown = async () => {
    // const userName = localStorage.getItem("IS_ADMIN") === "admin" ? "admin" : "user"
    // let callResponse = await userAjax(CONSTANTS.API_METHODS.GET, `${CONSTANTS.API.GET_CATEGORY_DD}/${localStorage.getItem('IS_ADMIN')}/${localStorage.getItem('USER_ID')}`,{},{id: localStorage.getItem("USER_ID")},{},);
    // let callData = callResponse.data.map((val) => ({name: val.category }));
    // const getbusinesscategory = addbusinesscategory !== null ? addbusinesscategory : callData[0].name
    const response1 = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GROUP_NAME_DROP_DOWN}/${localStorage.getItem('IS_ADMIN')}/${localStorage.getItem('USER_ID')}/${localStorage.getItem('CALL_CENTER_ID')}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
        // const response2 = await callRecordAjax(
    //   CONSTANTS.API_METHODS.GET,
    //   `${
    //   CONSTANTS.API.GET_NEW_CALL_RECORD}/${getbusinesscategory}/${userName}/${limit}/${offset}`,
    // {},
    // { id: localStorage.getItem("USER_ID") },
    // {}
    // )
    // let response = userName === 'admin' ? response1 : response2
    if (response1.status === CONSTANTS.STATUS.OK) {
      const newData = response1.data.map((val) => ({ name: val.groupCategory }));
      setBusinessCategory(newData);
    }
  };
  
  // const userDropdown = async() => {
  //   const userName = localStorage.getItem("IS_ADMIN") === "admin" ? "admin" : "user"
  //   let callResponse = await userAjax(CONSTANTS.API_METHODS.GET, `${CONSTANTS.API.GET_CATEGORY_DD}/${localStorage.getItem('IS_ADMIN')}/${localStorage.getItem('USER_ID')}`,{},{id: localStorage.getItem("USER_ID")},{},);
  //   let callData = callResponse.data.map((val) => ({name: val.category }));
  //   const getbusinesscategory = addbusinesscategory !== null ? addbusinesscategory : callData[0].name
  //   const response = await callRecordAjax(
  //     CONSTANTS.API_METHODS.GET,
  //     `${
  //     CONSTANTS.API.GET_NEW_CALL_RECORD}/${getbusinesscategory}/${userName}/${limit}/${offset}`,
  //   {},
  //   { id: localStorage.getItem("USER_ID") },
  //   {}
  //   )

  //   if (response.status === CONSTANTS.STATUS.OK) {
  //     setData(response.data);
  //               setCount(response.totalCount);
  //               const totalPages = Math.ceil(response.totalCount / limit);
  //               setTotalPage(totalPages);
  //               setNextLimit(totalPages === currentPage);
  //               setLoading(false);
  //       } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
  //           setData([]);
  //           setLoading(false);
  //           setCount(0);
  //           setTotalPage(0);
  //           setCurrentPage(0);
  //           setNextLimit(false);
  //       } else {
  //           setData([]);
  //           setLoading(false);
  //           setCount(0);
  //           setTotalPage(0);
  //           setCurrentPage(0);
  //           setNextLimit(false);
  //           handle_error(response.status, response.message);
  //       }
  // }
  
  const DownloadRecording = async (item) => {
    console.log('item------', item);
    const params = {
      bucketName: item.s3RecordingBucketName,
      key: item.s3RecordingFilePath,
    };
    const response = await callRecordAjax(CONSTANTS.API_METHODS.GET, CONSTANTS.API.DOWNLOAD_FILE, params, { id: localStorage.getItem('USER_ID') }, {});
   
    if (response.status === CONSTANTS.STATUS.OK) {
      startDownload(response.data[0], item);
      setLink(response.data[0]);
    }
   
    setLink('');
  };

  if (addbusinesscategory == '') {
    setAddBusinessCategory(null);
  }
  async function startDownload(url, fileName) {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    console.log("fileName: : ",fileName.recordingFileName)
   link.download = fileName.recordingFileName;
   
    link.click();
  }
  
  if (addbusinesscategory == '') {
    setAddBusinessCategory(null);
  }
   //   function startDownload(link1) {
  //     window.open(link1, 'Download');
  //  }

  // function startDownload(url) {
  //   let link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'abc.wav';
  //   link.click();
  // }
  // async function startDownload(url) {
  //   const response = await fetch(url);
  //   const blob = await response.blob();  
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = 'file';
  //   link.click();
  // }
  
  const renderTableRows = () => {
    return data.map((item) => (
      <tr>
        <td className="table-data">{item.groupName}</td>
        <td className="table-data">{item.callId}</td>
        <td className="table-data">{item.recordingFileName}</td>
        <td className="table-data">{item.calledNumber}</td>
        <td className="table-data">{item.applicationNo}</td>
        <td className="table-data">{item.policyNumber}</td>
        <td className="table-data">
          {item.callStartDate}   {item.callStartTime}
        </td>
        <td className="table-data">
          {item.callENDDate} {item.callENDTime}
        </td>
        <td className="table-data">
          <div className="table-data-icon">
          <button className="play pl-2" onClick={()=>{
               DownloadRecording(item)
             }}>Recording<img className="ml-1 playbutton" src={Play}></img></button>
            {/* <button
              className="play pl-2"
              onClick={() => {
                DownloadRecording(item);
              }}
            >
              Recording<img className="ml-1 playbutton" src={Play}></img>
            </button> */}

            {/* <a href={link} download onClick={()=> DownloadRecording(item)} className="download ml-1"><img className="ml-1" src={Upload}></img></a> */}
          </div>
        </td>
      </tr>
    ));
    // }
  };

  const renderTable = () => (
    <>
      <table className="table table-bordered">
        <thead className="tablehead">
          <tr>
            <th className="table-head" scope="col">
            Call Center
              {/* <img alt="" className="table-filter" src={Filter} onClick={() => setSort('groupName')} /> */}
            </th>
            <th className="table-head" scope="col">
              Call Id
            </th>
            <th className="table-head" scope="col">
              File Name
            </th>
            <th className="table-head" scope="col">
              Mobile No.
              {/* <img alt="" className="table-filter" src={Filter} onClick={() => setSort('calledNumber')} /> */}
            </th>
            <th className="table-head" scope="col">
              Application Number
            </th>
            <th className="table-head" scope="col">
              Policy Number
            </th>
            <th className="table-head" scope="col">
              Start Date & Time
              {/* <img alt="" className="table-filter" src={Filter} onClick={() => setSort('callStartDate')} /> */}
            </th>
            <th className="table-head" scope="col">
              End Date & Time
              {/* <img alt="" className="table-filter" src={Filter} onClick={() => setSort('callENDDate')} /> */}
            </th>
            <th className="table-head" scope="col">
              Recordings
            </th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      {loading === false && count === 0 && <div className="text-center">No data found</div>}
    </>
  );

  const getCallCenterDropDownData = async () => {
    const response = await userAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_CATEGORY_DD}/${localStorage.getItem('IS_ADMIN')}/${localStorage.getItem('USER_ID')}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      // const newCallcenterData = response.data.map((val) => ({ id: val.bucketname, name: val.category }));
      const newCallcenterData = response.data.map((val) => ({ name: val.category }));
      if (localStorage.getItem('IS_ADMIN') !== 'admin') {
        setCallCenter(newCallcenterData[0].name);
      }
      setCallCenterDDData(newCallcenterData);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setCallCenterDDData([]);
    } else {
      setCallCenterDDData([]);
      handle_error(response.status, response.message);
    }
  };

  const calculateMaxEndDate = () => {
    if (startDate) {
      const maxEndDate = new Date(startDate);
      maxEndDate.setDate(maxEndDate.getDate() + 15); // Allow 15 days from the start date
      return maxEndDate;
    }
    return null;
  };
  useEffect(() => {
    getCallCenterDropDownData();
    BusinessCategoryDropdown();
    getPhoneCallRecords(0);
  }, []);
  
  useEffect(() => {
    if(clearState){
      getPhoneCallRecords(0);
    }
  }, [clearState]);
  return (
    <>
      <div className={`content ${loading ? 'loading-blur' : ''}`}>
        {loading && <Loader />}
        <div className="centre">
        <div className="headertag">
              <b>Download Call Records</b>
            </div>
          <div className="headerline">
            
            <div>
              <Textbox
                type="number"
                styleClass="download-records-textbox"
                placeholder="Mobile No."
                value={addMobile}
                onChange={(e) => {
                  setMobileNo(e.target.value);
                  setAddMobile(e.target.value);
                  // SearchOnMobile(e.target.value);
                  setBusinessDrop(false);
                }}
                // onKeyDown={handleEnterKey}
              />
              {errorValidMobile ? <small className="text-danger font-weight-bold">Please enter valid Mobile No</small> : ''}
            </div>
            <div>
              <Textbox
                type="number"
                styleClass="download-records-textbox"
                placeholder="Application No."
                value={addapplication}
                onChange={(e) => {
                  setApplicationNumber(e.target.value);
                  setAddApplication(e.target.value);
                  // SearchOnMobile(e.target.value);
                  setBusinessDrop(false);
                }}
                // onKeyDown={handleEnterKey}
              />
              {errorValidApplication ? <small className="text-danger font-weight-bold">Please enter valid Application No</small> : ''}
            </div>
            <div>
              <Textbox
                type="number"
                styleClass="download-records-textbox"
                placeholder="Policy No."
                value={addPolicy}
                onChange={(e) => {
                  setPolicyNumbers(e.target.value);
                  setAddPolicy(e.target.value);
                  setBusinessDrop(false);
                }}
                // onKeyDown={handleEnterKey}
              />
              {errorValidPolicy ? <small className="text-danger font-weight-bold">Please enter valid Policy No</small> : ''}
            </div>
            <Dropdown
              value={addbusinesscategory}
              name="Call Center"
              styleClass="download_call_dropdown"
              options={businesscategory}
              // disabled={localStorage.getItem('IS_ADMIN') !== 'admin'}
              onDropDownChange={(e) => {
                DropdownValue(e)
                setBusinessDrop(true)
                // setNewCallCenter(e.target.value);
              }}
            />
            
            {/* {localStorage.getItem('IS_ADMIN') === 'admin' ? (
              <Dropdown
                value={addbusinesscategory}
                name="Call Center"
                // name="Buisness Category"
                styleClass="download_call_dropdown"
                options={businesscategory}
                onDropDownChange={(e) => {
                  DropdownValue(e);
                  setBusinessDrop(true);
                }}
              />
            ) : (
              ''
            )} */}
            
            <div className="filterContainer-dc">
              <div
                className=" filterAppointmentStart d-flex"
                style={{
                  border: '2px solid #ED1C24',
                  borderRadius: '5px',
                  padding: '10px',
                }}
              >
                <DatePicker
                  className="border border-0  coloe hideOutline  text-dark datePicker-Input"
                  placeholderText="Start Date"
                  selected={startDate}
                   // onChange={(date) => {
                    //   setStartDateFun(date);
                  //   setBusinessDrop(false);
                  // }}
                  onChange={handleStartDateChange}
                  // timeInputLabel="Time:"
                  dateFormat="dd/MM/yyyy"
                  // showTimeInput
                  maxDate={new Date()}

                  // disabled={false}
                />
                <img className="pointer calEndDateIcon mt-1 " src={calenderImage} alt="Logo" height="25" width="25" />
              </div>
              <div
                className="filterAppointmentStart d-flex"
                style={{
                  border: '2px solid #ED1C24',
                  borderRadius: '5px',
                  padding: '10px',
                }}
              >
                <DatePicker
                  className="border border-0 coloe hideOutline text-dark datePicker-Input"
                  placeholderText="End Date"
                  selected={endDate}
                  // onChange={(date) => {
                  //   setEndDateFun(date);
                  //   setBusinessDrop(false);
                  // }}
                  onChange={(date) => setEndDateFun(date)}
                      // timeInputLabel="Time:"
                  dateFormat="dd/MM/yyyy"
                  minDate={startDate}
                   // showTimeInput
                  // disabled={isEmpty(startDate)}
                  // minDate={startDate}
                  maxDate={maxEndDate}
                  // title={
                  //     isEmpty(startDate) ? 'Please select start date first.' : ''
                  // }
                />
                <img className="pointer calEndDateIcon mt-1 " src={calenderImage} alt="Logo" height="25" width="25" />
              </div>
            </div>
            <button className="ClearButton" onClick={clearFilters} style={{ color: 'white' }}>
    Clear
</button>
            <button className="SearchIcon" onClick={searchOnClick}>
              <img src={searchIcon} alt="Search" height="20" width="20" />
            </button>
          </div>

          <div className="table1 table-responsive">
            <div className="ctc-table">{renderTable()}</div>
          </div>

          <div  className="pagination-container  mt-2">
            {loading === false && count !== 0 && (
                  // <nav >
                <ReactPaginate
                pageCount={totalPage}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                nextLinkClassName={'nextButtonLink'}
                previousLinkClassNameLinkClassName={'previousButtonLink'}
                pageLinkClassName={'pageNumberLink'}
                previousLinkClassName={'previousButtonLink'}
                forcePage={currentPage - 1} 
              />
            )}
          </div>
          {/* <div className="d-flex justify-content-end">{pagination()}</div> */}
        </div>
      </div>
    </>
  );
};

export default Download_call_records;
