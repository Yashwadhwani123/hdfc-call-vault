import React, { useEffect, useState } from 'react';
// import Topnav from "../components/common/topnav";
// import Sidebar from "../components/common/sidebar";
// import "../stylesheets/callcentre.css";
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import Button from '../components/common/button';
import RegularDropdown from '../components/common/regulardropdown';
import RegularTextBox from '../components/common/regulartextbox';
import FileUpload from '../images/Icon file-upload.png';
import document from '../images/document.png';
import '../stylesheets/callrecords.css';
import '../stylesheets/common/modal.css';
import callRecordAjax from '../utils/callRecordAjax';
import CONSTANTS from '../utils/constants';
import handle_error from '../utils/handle';
import isEmpty from '../utils/isEmpty';
import isInvalidArray from '../utils/isEmptyArray';
import userAjax from '../utils/userAjax';
toast.configure();

const MetaData = () => {
  const [fileList, setFileList] = useState([]);
  const [fileFlag, setFileFlag] = useState(false);
  const [files, setFiles] = useState([]);
  const [validFiles, setValidFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadRecord, setUploadRecord] = useState(false);
  const [uploadResult, setUploadResult] = useState(false);
  const [resultAfterUpload, setResultAfterUpload] = useState(false);
  const [newFileList, setNewFileList] = useState(false);
  const [callCenterDDData, setCallCenterDDData] = useState([]);
  const [callCenter, setCallCenter] = useState('');
  const [s3Url, setS3Url] = useState('');
  const [errorCallCenter, setErrorCallCenter] = useState(false);
  const [errorS3Url, setErrorS3Url] = useState(false);
  const [errorFile, setErrorFile] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [messsage, setMesssage] = useState('');
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [totalFailedCount, setTotalFailedCount] = useState(0);
  const [successFile, setSuccessFile] = useState([]);
  const [checkStatusFlag, setCheckStatusFlag] = useState(false);
  const [check_Status, setCheck_Status] = useState(false);
  const [file, setFile] = useState('');
  const [checkStatusMessage, setCheckStatusMessage] = useState('');
  const [successList, setSuccessList] = useState([]);
  const [failedList, setFailedList] = useState([]);
  const [currentPageCount, setCurrentPageCount] = useState(0);
  const [alreadyExistsCount, setAlreadyExistCount] = useState(0);
  const [successFile1, setSuccessFile1] = useState([]);
  const [getStatus, setGetStatus] = useState('');
  const [statusDate, setStatusDate] = useState('');
  const [statusError, setStatusError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [metaFailCount, setMetaFailCount] = useState(false);

  const data = [
    {
      date: '31-03-2022',
      name: 'Call Centre 1',
      category: 'Bucket Path 1',
      path: 'Bucket Path 1',
    },
  ];

  const renderTable = () => (
    <>
      <table className="table table-bordered">
        <thead className="tablehead">
          <tr>
            <th className="table-head" scope="col">
              Date
            </th>
            <th className="table-head" scope="col">
              File Name
            </th>
            <th className="table-head" scope="col">
              Category
            </th>
            <th className="table-head" scope="col">
              S3 File Path
            </th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </>
  );
  const renderTableRows = () => {
    if (data.length > 0) {
      return data.map((item, index) => (
        <tr>
          <td className="table-data">{item.date}</td>
          <td className="table-data">{item.name}</td>
          <td className="table-data">{item.category}</td>
          <td className="table-data">{item.path}</td>
        </tr>
      ));
    }
  };
  const removeFile = (name) => {
    // find the index of the item
    // remove the item from array
    const validFileIndex = files.findIndex((e) => e.name === name);
    files.splice(validFileIndex, 1);
    // update validFiles array
    setValidFiles([...validFiles]);
    const selectedFileIndex = selectedFiles.findIndex((e) => e.name === name);
    selectedFiles.splice(selectedFileIndex, 1);
    // update selectedFiles array
    setSelectedFiles([...selectedFiles]);
    // setNewFileList(selectedFiles.length > 0);
  };
  const thumbs = files.map((file) => (
    <div className="col-sm fileDisplay p-1 border rounded shadow-none text-dark " key={file.name}>
      <div className="fileName">{file.name.split('.').slice(0, -1).join('.')}</div>
      <div
        className="file-remove"
        onClick={() => {
          removeFile(file.name);
        }}
      >
        X
      </div>
    </div>
  ));

  const getCallCenterDropDownData = async () => {
    console.log('userId', localStorage.getItem('USER_ID'));
    const response = await userAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_CATEGORY_DD}/${localStorage.getItem('IS_ADMIN')}/${localStorage.getItem('USER_ID')}`,
      {},
      { id: localStorage.getItem('USER_ID') },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      const newCallcenterData = response.data.map((val) => ({
        id: val.bucketname,
        name: val.category,
      }));
      if (localStorage.getItem('IS_ADMIN') !== 'admin') {
        setCallCenter(newCallcenterData[0].id);
      }
      setCallCenterDDData(newCallcenterData);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setCallCenterDDData([]);
    } else {
      setCallCenterDDData([]);
      handle_error(response.status, response.message);
    }
  };

  useEffect(() => {
    getCallCenterDropDownData();
    if (files) {
      setValidFiles(files);
    }
  }, [files]);

  useEffect(() => {
    const filteredArray = selectedFiles.reduce((file, current) => {
      const x = file.find((item) => item.name === current.name);
      if (!x) {
        return file.concat([current]);
      }
      return file;
    }, []);
    setValidFiles([...filteredArray]);
  }, [selectedFiles]);

  const onFileSelect = (params) => {
    setNewFileList(true);
    setFiles(
      params.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };
  // const
  const isValid = () => {
    if (isEmpty(callCenter) || isEmpty(s3Url) || isInvalidArray(files) || files.length > 1) {
      return false;
    }
    return true;
  };
  const onUploadRecordClick = async () => {
    if (isValid()) {
      setNewFileList(false);
      setFileFlag(true);
      setCheckStatusFlag(true);
      const formData = new FormData();
      const bodyParams = {
        category: callCenter,
        s3Location: s3Url,
        uploadedBy: localStorage.getItem('USER_ID'),
      };
      // let bodyParams = { category: 'aws-hdfc-test/test', s3Location: 'aws-hdfc-test', uploadedBy: localStorage.getItem('USER_ID') };
      formData.append('docfile ', files[0]);
      formData.append('requestBody', JSON.stringify(bodyParams));
      const response = await callRecordAjax(CONSTANTS.API_METHODS.POST, CONSTANTS.API.UPLOAD_META_FILE, {}, { id: localStorage.getItem('USER_ID') }, formData);

      if (response.status === CONSTANTS.STATUS.OK) {
        setFileFlag(false);
        setShowSuccess(true);
        setShowError(false);
        setMesssage(response.message);
        setTotalUploadCount(response.data[0].successListCount);
        setTotalFailedCount(response.data[0].failedListCount);
        setSuccessFile(response.data[0].failedList);
        // setMetaFailCount(response.data[0]?.metaFileAlreadyUploadedFlag);
        setCallCenter('');
        setS3Url('');
        // setFiles([]); // commented for hiding error please select csvs
        setFile(response.data[0]);
      } else {
        console.log('logggg-------------', response);
        setFileFlag(false);
        setMesssage(response.message);
        // setTotalUploadCount(response.data[0].failedListCount);
        setShowSuccess(false);
        setShowError(true);
        setCallCenter('');
        setS3Url('');
        setFiles([]);
        handle_error(response.status, response.message);
      }
    } else {
      setFileFlag(false);
      setErrorCallCenter(isEmpty(callCenter));
      setErrorS3Url(isEmpty(s3Url));
      // setErrorS3Url(isEmpty(s3Url));
      setErrorFile(isInvalidArray(files) || files.length > 1);
      setShowError(false);
      setShowError(false);
    }
  };
  const checkStatus = () => {
    // setCurrentPage(currentPage + 1);
    setCheckStatusMessage([]);
    setSuccessList([]);
    setFailedList([]);
    callRecordAjax(CONSTANTS.API_METHODS.GET, `${CONSTANTS.API.CHECK_STATUS}/${localStorage.getItem('USER_ID')}/1/0`, {}, { id: localStorage.getItem('USER_ID') }, {})
      .then(async (response) => {
        // finalResponse.push(response);
        if (response.status === CONSTANTS.STATUS.OK) {
          setShowSuccess(true);
          setCurrentPageCount(response.totalCount);
          setCheck_Status(true);
          setMesssage(response?.message || response?.statusMessage);
          setTotalUploadCount(response?.data[0]?.successListCount);
          setTotalFailedCount(response?.data[0]?.failedListCount);
          setMetaFailCount(response.data[0]?.metaFileAlreadyUploadedFlag);

          setAlreadyExistCount(response?.data[0]?.totalCount);
          setSuccessFile(response?.data[0]?.failedList);
          setSuccessFile1(response?.data[0]?.alreadyList);
          setGetStatus(response?.data[0]?.status);
          setStatusDate(response?.data[0]?.activityDate);
          setStatusError(response?.data[0]?.error);
          setCheckStatusMessage(response?.data[0]?.metaFileName);
          setSuccessList(
            response?.data[0]?.successList?.filter((e) => {
              return e;
            }) || 0
          );
          setFailedList(
            response?.data[0]?.failurelist?.filter((e) => {
              return e;
            }) || 0
          );
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const onNext = async () => {
    setCheckStatusMessage([]);
    setSuccessList([]);
    setFailedList([]);
    await setCurrentPage(() => {
      return currentPage + 1;
    });
    callRecordAjax(CONSTANTS.API_METHODS.GET, `${CONSTANTS.API.CHECK_STATUS}/${localStorage.getItem('USER_ID')}/1/${currentPage + 1}`, {}, { id: localStorage.getItem('USER_ID') }, {})
      .then(async (response) => {
        // finalResponse.push(response);
        console.log('resp ####', response);
        if (response.status === CONSTANTS.STATUS.OK) {
          setCheck_Status(true);
          setMesssage(response?.message || response?.statusMessage);
          setTotalUploadCount(response?.data[0]?.successListCount);
          setTotalFailedCount(response?.data[0]?.recordingNotPresentListCount);
          // setMetaFail(response.data[0]?.metaFileAlreadyUploadedFlag);
          setAlreadyExistCount(response?.data[0]?.alreadyListCount);
          setSuccessFile(response?.data[0]?.failedList);
          setSuccessFile1(response?.data[0]?.alreadyList);
          setGetStatus(response?.data[0]?.status);
          setStatusDate(response?.data[0]?.activityDate);
          setStatusError(response?.data[0]?.error);
          setCheckStatusMessage(response?.data[0]?.metaFileName);
          setSuccessList(
            response?.data[0]?.successList?.filter((e) => {
              return e;
            }) || 0
          );
          setFailedList(
            response?.data[0]?.failurelist?.filter((e) => {
              return e;
            }) || 0
          );
        }
      })
      .catch((error) => {
        console.log('error define', error);
      });
  };
  const download_success_data = () => {
    // const csvContent = [["Sr.No", "Success List"]].concat(successList.map((item, index) => `${index + 1}. ${item}`))
    // .join("\n");
    const csvContent = ["Success List"].concat(successList).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    console.log('success ------------', successList);

    try {
      let a = window.document.createElement('a');
      console.log('a>>>>>>>>>>>', a);
      a.href = url;
      // a.href = 'data:application/octet-stream,' + encodeURIComponent(`${successList.join('\n')}`);
      a.download = 'Uploaded Records.csv';
      a.click();
    } catch (err) {
      console.log('error Uploaded Records----------------', err);
    }
  };
  const onPrevious = async () => {
    setCheckStatusMessage([]);
    setSuccessList([]);
    setFailedList([]);
    await setCurrentPage(() => {
      return currentPage - 1;
    });
    callRecordAjax(CONSTANTS.API_METHODS.GET, `${CONSTANTS.API.CHECK_STATUS}/${localStorage.getItem('USER_ID')}/1/${currentPage - 1}`, {}, { id: localStorage.getItem('USER_ID') }, {})
      .then(async (response) => {
        // finalResponse.push(response);
        console.log('resp ####', response?.data[0]?.successList);
        if (response.status === CONSTANTS.STATUS.OK) {
          setCheck_Status(true);
          setMesssage(response?.message || response?.statusMessage);
          setTotalUploadCount(response?.data[0]?.successListCount);
          setTotalFailedCount(response?.data[0]?.recordingNotPresentListCount);
          // setMetaFail(response.data[0]?.metaFileAlreadyUploadedFlag);
          setAlreadyExistCount(response?.data[0]?.alreadyListCount);
          setSuccessFile(response?.data[0]?.failedList);
          setSuccessFile1(response?.data[0]?.alreadyList);
          setGetStatus(response?.data[0]?.status);
          setStatusDate(response?.data[0]?.activityDate);
          setStatusError(response?.data[0]?.error);
          setCheckStatusMessage(response?.data[0]?.metaFileName);
          setSuccessList(
            response?.data[0]?.successList?.filter((e) => {
              return e;
            }) || 0
          );
          setFailedList(
            response?.data[0]?.failurelist?.filter((e) => {
              return e;
            }) || 0
          );
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const onCallCenterChange = (e) => {
    setCallCenter(e.target.value);
    setErrorCallCenter(isEmpty(e.target.value));
  };
  const onS3UrlChange = (e) => {
    setS3Url(e.target.value);
    setErrorS3Url(isEmpty(e.target.value));
  };
  const download_data = () => {
    try {
      let a = window.document.createElement('a');
      a.href = 'data:application/octet-stream,' + encodeURIComponent(`${successFile.join(', ')}`);
      a.download = 'failureRecords.txt';
      a.click();
    } catch (err) {
      console.log('error----------------', err);
    }
  };
  const download_failed_data = () => {
    // const csvContent = ["Sr.No", "Failed List"]
    // .concat(failedList.map((item, index) => `${index + 1}. ${item}`))
    // .join("\n");
    // console.log(' csvContent>>>>>>>>>', csvContent)
    const csvContent = ["Failed List"].concat(failedList).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
   const url = window.URL.createObjectURL(blob);
    console.log('failed ------------', failedList);
    try {
      let a = window.document.createElement('a');
      a.href=url
      // a.href = 'data:application/octet-stream,' + encodeURIComponent(`${failedList.join('\n')}`);
      a.download = 'Failed Records.csv';
      console.log('download>>>>>>>>>>>>>>>', a.download)
      a.click();
    } catch (err) {
      console.log('error Failed Records----------------', err);
    }
  };

  return (
    <>
      <div className="content">
        <div className="centrecontent">
          <div className="headerline">
            <div className="headertag">
              <b>Metadata Records</b>
            </div>
          </div>
          <div className="container-fluid callRecordHeader">
            <div className="inputPart">
              <div className="recordsDropdown">
                <RegularDropdown
                  id="selectcategory"
                  name="Select Category"
                  value={callCenter}
                  labelText=""
                  styleClass="reports_dropdown"
                  // dropdownLabel={"Call Centre"}
                  options={callCenterDDData}
                  disabled={localStorage.getItem('IS_ADMIN') !== 'admin'}
                  onDropDownChange={(e) => {
                    onCallCenterChange(e);
                  }}
                />
                {errorCallCenter ? <small className="text-danger font-weight-bold">Please select category</small> : ''}
              </div>
              <div className="recordsTextbox">
                <RegularTextBox
                  textLabel="Call Center Name"
                  required=""
                  placeholder="Call Center Name"
                  name="Call Center Name"
                  id="Call Center Name"
                  value={s3Url}
                  onChange={(e) => {
                    onS3UrlChange(e);
                  }}
                />
                {errorS3Url ? <small className="text-danger font-weight-bold">Please enter call center name</small> : ''}
              </div>
            </div>
            <div className="col-sm-7 dragAndDropPart">
              <div className="dropzone">
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    onFileSelect(acceptedFiles);
                  }}
                  accept="text/csv"
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div
                          className="dropFont "
                          onClick={() => {
                            setFileList(true);
                          }}
                        >
                          <b className="adjust">
                            <div className="pr-3">
                              <img src={document} alt="document" className="img-responsive" />
                            </div>
                            <p>
                              Drop your files here or <b className="browse">Browse</b>
                            </p>
                          </b>
                        </div>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
              {!newFileList ? (
                <div className="textDropzone">
                  <b>Please Add Meta files</b>
                </div>
              ) : (
                <div className="textDropzoneFile">{thumbs}</div>
              )}
              {errorFile ? <small className="text-danger font-weight-bold justify-items-center">{files.length !== 0 ? ' ' : 'Please select CSV file'}</small> : ''}
            </div>
            {newFileList ? (
              <div className="recordValidationbtn">
                <Button
                  styleClass="standardButton checkStatusButton"
                  text="Upload Metadata"
                  onClick={() => {
                    onUploadRecordClick();
                    setCheckStatusFlag(true);
                  }}
                />
              </div>
            ) : (
              ''
            )}
            {fileFlag ? (
              <div className="file-loader">
                <div class="spinner-border text-danger ml-3 mb-1" role="status">
                  {/* <span class="sr-only">Loading...</span> */}
                </div>
                <div>
                  <span>Loading...</span>
                </div>
              </div>
            ) : (
              ''
            )}          
          </div>
        </div>
        {showSuccess && (
          <div className="response-display">
            <div className="mainAlertBox" role="alert">
              <p className="alertBox">
                <b className="alertFont1">{messsage}</b>
              </p>
              <p className="alertBox">
                <b className="alertFont1">{file}</b>
              </p>
            </div>
          </div>
        )}
        {showSuccess && checkStatusFlag ? (
        
          <div className="check-status-button"  style={{ marginTop: '20px' }}>
            <Button
              styleClass="standardButton checkStatusButton"
              text="Check Status"
              onClick={() => {
                checkStatus();
              }}
            />
          </div>
        
        ) : (
          ''
        )}
        
        {check_Status && (
          <>
            <div className="middlehalf">
              <div class=" cardStyle">
                <div>
                  <h5 class=" textStyle ">
                    <b>Status</b>
                  </h5>
                  <p class="card-text textStyle">{getStatus}</p>
                </div>
              </div>
              <div class="cardStyle ">
                <h5 class="textStyle">
                  <b>Date & Time</b>
                </h5>
                <p class="card-text textStyle">{statusDate}</p>
              </div>
              <div class="cardStyle">
                <div onClick={() => download_success_data()}>
                  <h5 class="textStyle">
                    <b>Total Records Uploaded</b>
                  </h5>
                  <p class="card-text textStyle">
                    {totalUploadCount}
                    <img className=" downloadIcon" src={FileUpload} alt="Download Icon" />
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {check_Status && (
          <>
            <div className="middlehalf">
              <div class="errorCard">
                <div>
                  <h5 class="errorTextStyle">
                    <b>Error</b>
                  </h5>
                  <p class="card-text" style={{ color: 'red' }}>
                    {statusError}
                  </p>
                </div>
              </div>
              <div class="cardStyle">
                <div onClick={() => download_failed_data()}>
                  <h5 class="textStyle">
                    <b>Total Failure List</b>
                  </h5>
                  <p class="card-text textStyle" >
                    {totalFailedCount}
                    <img className="  downloadIconFailureList" src={FileUpload} />
                  </p>
                </div>
              </div>
              <div class="cardStyle">
                <div>
                  <h5 class="textStyle">
                    <b> Meta File already uploaded</b>
                  </h5>
                  <p class="card-text textStyle">{metaFailCount ? 'True' : 'False'}</p>
                </div>
              </div>
            </div>
          </>
        )}
        {check_Status && (
          <>
            {/* <div className="check-status-button">
              {currentPage > 0 ? (
                <Button
                  styleClass="standardButton standardLightButton"
                  text="Prevoius"
                  onClick={() => {
                    onPrevious();
                  }}
                />
              ) : (
                ''
              )}
              {currentPage != currentPageCount - 1 ? (
                <Button
                  styleClass="standardButton standardDarkButton"
                  text="Next"
                  onClick={() => {
                    onNext();
                  }}
                />
              ) : (
                ''
              )}
            </div> */}
          </>
        )}
        {showError && (
          <div className="middlehalf">
            <div className="mainAlertBoxError" role="alert">
              <p className="alertBoxError">
                <b className="alertFont1">{messsage}</b>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MetaData;
