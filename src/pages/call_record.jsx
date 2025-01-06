import React, { useEffect, useReducer, useRef, useState } from "react";
// import Topnav from "../components/common/topnav";
// import Sidebar from "../components/common/sidebar";
// import "../stylesheets/callcentre.css";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../components/common/button";
import RegularDropdown from "../components/common/regulardropdown";
import FileUpload from "../images/Icon file-upload.png";
import document from "../images/document.png";
import "../stylesheets/callrecords.css";
import "../stylesheets/common/modal.css";
import callRecordAjax from "../utils/callRecordAjax";
import CONSTANTS from "../utils/constants";
import handle_error from "../utils/handle";
import { all, series, splitToChunks } from "../utils/helper";
import isEmpty from "../utils/isEmpty";
import isInvalidArray from "../utils/isEmptyArray";
import userAjax from "../utils/userAjax";
toast.configure();

const CallRecords = () => {
  const fileRef = useRef();
  const [fileValues, setFileValues] = useState([]);
  const [fileFlag, setFileFlag] = useState(false);
  // let [files, setFiles] = useState([]);
  // let files = []
  const [validFiles, setValidFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadRecord, setUploadRecord] = useState(false);
  const [uploadResult, setUploadResult] = useState(false);
  const [resultAfterUpload, setResultAfterUpload] = useState(false);
  const [newFileList, setNewFileList] = useState(false);
  const [callCenterDDData, setCallCenterDDData] = useState([]);
  const [callCenter, setCallCenter] = useState("");
  const [s3Url, setS3Url] = useState("");
  const [errorCallCenter, setErrorCallCenter] = useState(false);
  const [errorS3Url, setErrorS3Url] = useState(false);
  const [errorFile, setErrorFile] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [messsage, setMesssage] = useState("");
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [metaFile, setMetaFile] = useState("");
  const [errorMetaFile, setErrorMetaFile] = useState(false);
  const [metaFileData, setMetaFileData] = useState([]);
  const [fileloading, setFileLoading] = useState(false);
  // const [totalFileCount, setTotalFileCount] = useState(0);
  const [count, setCount] = useState(0);
  const [totalFailedCount, setTotalFailedCount] = useState(0);
  const [alreadyExistsCount, setAlreadyExistCount] = useState(0);
  const [fileRecordingPath, setFileRecordingPath] = useState("");
  const [successFile, setSuccessFile] = useState([]);
  const [successFile1, setSuccessFile1] = useState([]);
  const [bucketName, setBucketName] = useState("");
  const [callCenterName, setCallCenterName] = useState("");
  const [fileCount, setFileCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [proceedFlag, setProceedFlag] = useState(false);
  const [check_Status, setCheck_Status] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [getStatus, setGetStatus] = useState("");
  const [statusDate, setStatusDate] = useState("");
  const [statusError, setStatusError] = useState("");
  const [currentPageCount, setCurrentPageCount] = useState(0);
  const [checkStatusFlag, setCheckStatusFlag] = useState(false);
  const [checkStatusMessage, setCheckStatusMessage] = useState("");
  const [successList, setSuccessList] = useState([]);
  const [failedList, setFailedList] = useState([]);
  let requestId = "";
  // let count = 0;
  let totalFileCount = 0;
  let totalCount = 0;
  let fileFailedCount = 0;
  const data = [
    {
      date: "31-03-2022",
      name: "Call Centre 1",
      category: "Bucket Path 1",
      path: "Bucket Path 1",
    },
  ];

  const initialState = {
    files: [],
    // retryFiles: [],
  };
  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_FILES':
        return { ...state, files: action.payload };
      // case 'SET_RETRY_FILES':
      //   return { ...state, retryFiles: action.payload };
      default:
        return state;
    }
  };
  
  const [state, dispatch] = useReducer(reducer, initialState);

  const { files } = state

  let retryFiles = []

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
  // const thumbs = files.map((file) => (
  //     <div className="col-sm fileDisplay p-1 border rounded shadow-none text-dark" key={file.name}>
  //         <div className="fileName">
  //             {file.name.split('.').slice(0, -1).join('.')}
  //         </div>
  //         <div
  //             className="file-remove"
  //             onClick={() => {
  //                 removeFile(file.name);
  //             }}
  //         >
  //     X
  //         </div>
  //     </div>
  // ));

  const getCallCenterDropDownData = async () => {
    const response = await userAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_CATEGORY_DD}/${localStorage.getItem(
        "IS_ADMIN"
      )}/${localStorage.getItem("USER_ID")}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      const newCallcenterData = response.data.map((val) => ({
        id: val.bucketname,
        name: val.category,
      }));
      if (localStorage.getItem("IS_ADMIN") !== "admin") {
        setCallCenter(newCallcenterData[0].id);
        setCallCenterName(newCallcenterData[0].name);
        // setBucketName(newCallcenterData[0].name)
      }
      setCallCenterDDData(newCallcenterData);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setCallCenterDDData([]);
    } else {
      setCallCenterDDData([]);
      handle_error(response.status, response.message);
    }
  };

  const getMetaFileData = async () => {
    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.GET_META_FILE_DD}/${localStorage.getItem("USER_ID")}`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    );
    if (response.status === CONSTANTS.STATUS.OK) {
      const newMetaFileData = response.data.map((val) => ({
        id: val.metafilename,
        name: val.metafilename,
      }));
      setMetaFileData(newMetaFileData);
    } else if (response.status === CONSTANTS.STATUS.DATA_NOT_FOUND) {
      setMetaFileData([]);
    } else {
      setMetaFileData([]);
      handle_error(response.status, response.message);
    }
  };

  useEffect(() => {
    getCallCenterDropDownData();
    getMetaFileData();
    // if (files) {
    //   setValidFiles(files);
    // }
  // }, [files]);
  }, []);

  useEffect(() => {
    // getCallCenterDropDownData();
    // getMetaFileData();
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

  const onFileSelect = async (e) => {
    let params = [...e.target.files];
    if (params.length > 50000) {
      setFileFlag(false);
      toast.error("cant exceed file count 50000 ...!!!", {
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
      await setNewFileList(true);
      // await setFiles(params);
      dispatch({
        type: 'SET_FILES',
        payload: params,
      });
      // files = params
      //   params.map((file) =>
      //     Object.assign(file, {
      //       preview: URL.createObjectURL(file),
      //     })
      //   )
      // );
      setFileFlag(false);
    }

    // setTimeout(async()=>{
    //     await setNewFileList(true);
    // await setFiles(
    //     params.map((file) => Object.assign(file, {
    //         preview: URL.createObjectURL(file),
    //     })),
    // )
    // setFileFlag(false)
    // },5000)
  };
  // document.getElementById('fileInput').onchange = ()=>{
  //     setFileFlag(true)
  // }

  // const
  const isValid = () => {
    if (isEmpty(callCenter) || isInvalidArray(files) || isEmpty(metaFile)) {
      return false;
    }
    return true;
  };
  let fileArray = [];
  let finalResponse = [];
  let filePath = "";
  const uploadFile = async (filesData) => {
    let tempArray = [];
    let params = {
      callCenterName: callCenter,
      fileName: filesData.name,
      bucketName: callCenter,
      // bucketName: 'jar-file-bucket',
    };
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const response = await callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      CONSTANTS.API.GET_PREURL,
      params,
      { id: localStorage.getItem("USER_ID") },
      {}
    )
      .then(async (response) => {
        await setFileRecordingPath(response.data[0].s3RecordingFilePath);
        filePath = response.data[0].s3RecordingFilePath;
        const formData = new FormData();
        formData.append("docfile ", filesData);
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: filesData,
        };

        // await new Promise((resolve) => setTimeout(resolve, 5000));
        
        const axiosResponse = await fetch(
          response.data[0].preSignedUrl,
          requestOptions
        )
          .then(async (response) => {
            requestId = response.headers.get("X-Amz-Request-Id");
            totalFileCount = totalFileCount + 1;
            //   a = a + 1;
            await setFileCount(totalFileCount);
            // let tempFiles = files.filter((i) => i.name != filesData.name);
            // dispatch({
            //   type: 'SET_FILES',
            //   payload: tempFiles,
            // });
            // if (response.status != 200) {
            //   totalFileCount = totalFileCount - 1;
            //   await setFileCount(totalFileCount);
            //   files.push(filesData);
            //   return response;
            // }
          })
          .catch(async (e) => {
            // fileFailedCount = fileFailedCount + 1;
            // await setFailedCount(fileFailedCount);
            // totalFileCount = totalFileCount - 1;
            //   await setFileCount(totalFileCount);
              // files.push(filesData);
              
              // setFiles(...files,filesData)
              retryFiles.push(filesData)
              // dispatch({
              //   type: 'SET_RETRY_FILES',
              //   payload: [...retryFiles,filesData],
              // });
            console.log("errr------------------", e);
          });

        fileArray.push({
          fileName: filesData.name,
          metaFileName: metaFile,
          uploadedBy: localStorage.getItem("USER_ID"),
          bucketName: callCenter,
          s3RecordingFilePath: response.data[0].s3RecordingFilePath,
          requestId: requestId,
        });
        if (totalCount > 0) {
          if (fileArray.length >= totalFileCount) {
            // dbUpload(fileArray)
            // setFileFlag(false)
            await setNewFileList(false);
            // await setProceedFlag(true);
            await setFileValues(fileArray);
          }
        }
        return axiosResponse;
      })
      .catch(async (err) => {
        fileFailedCount = fileFailedCount + 1;
        await setFailedCount(fileFailedCount);
        console.log("first api err", err);
        files.push(filesData);
        return err;
      });
    return fileArray;
  };
  const dbUpload = (value) => {
    setProceedFlag(false);
    setFileFlag(true);
    value = [
      ...new Map(value.map((item) => [item["fileName"], item])).values(),
    ];
    callRecordAjax(
      CONSTANTS.API_METHODS.POST,
      CONSTANTS.API.SAVE_DATA_DB,
      {},
      { id: localStorage.getItem("USER_ID") },
      value
    )
      .then((response) => {
        finalResponse.push(response);
        if (response.status === CONSTANTS.STATUS.OK) {
          setFileFlag(false);
          setProceedFlag(false);
          setFileLoading(false);
          setShowSuccess(true);
          setShowError(false);
          setMesssage(response?.message || response?.statusMessage);
          // setTotalUploadCount(response?.data[0]?.successListCount);
          // setTotalFailedCount(response?.data[0]?.failedListCount);
          // setAlreadyExistCount(response?.data[0]?.alreadyListCount);
          // setSuccessFile(response?.data[0]?.failedList);
          // setSuccessFile1(response?.data[0]?.alreadyList);
          setCallCenter("");
          setS3Url("");
          // setFiles([]);
          dispatch({
            type: 'SET_FILES',
            payload: [],
          });
          // files = []
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  let tempFile = [];

  const chunks = (items, fn, chunkSize = 50) => {
    let result = [];
    const chunks = splitToChunks(items, chunkSize);
    return series(chunks, (chunk) => {
      return all(chunk, fn).then((res) => (result = result.concat(res)));
    }).then(() => result);
  };

  const onUploadRecordClick = async () => {
    setFileLoading(true);
    if (isValid()) {
      setCount(files.length);
      totalCount = files.length;
      chunks(files, uploadFile)
        .then(async(res) => {
          if (files.length) {
            
            // dispatch({
            //   type: 'SET_FILES',
            //   payload: [...new Map(files.map((item) => [item["path"], item])).values()],
            // });
            // files = [
            //   ...new Map(files.map((item) => [item["path"], item])).values(),
            // ];
            await new Promise((resolve) => setTimeout(resolve, 10000));
            chunks(retryFiles, uploadFile).then((res) => {
            setProceedFlag(true);
            totalCount = totalCount + res.length;
            setFileCount(totalFileCount);
            });
          } else {
            setProceedFlag(true);
          }
        })
        .catch((err) => {
          console.log("err :: ", err);
        });
    } else {
      setErrorCallCenter(isEmpty(callCenter));
      setErrorS3Url(isEmpty(s3Url));
      setErrorMetaFile(isEmpty(metaFile));
      // setErrorS3Url(isEmpty(s3Url));
      setErrorFile(isInvalidArray(files));
      setShowError(false);
      setShowError(false);
    }
  };

  const onCallCenterChange = (e) => {
    setCallCenter(e.target.value);
    setErrorCallCenter(isEmpty(e.target.value));
  };

  const onMetaFileChange = (e) => {
    setMetaFile(e.target.value);
    setErrorMetaFile(isEmpty(e.target.value));
  };

  // const download_data = () => {
  //   try {
  //     let a = window.document.createElement("a");
  //     a.href =
  //       "data:application/octet-stream," +
  //       encodeURIComponent(`${successFile.join(",")}`);
  //     a.download = "failureRecords.txt";
  //     a.click();
  //   } catch (err) {
  //     console.log("error----------------", err);
  //   }
  // };

  // const download_data1 = () => {
  //   try {
  //     let a = window.document.createElement("a");
  //     a.href =
  //       "data:application/octet-stream," +
  //       encodeURIComponent(`${successFile1.join(",")}`);
  //     a.download = "failureRecords.txt";
  //     a.click();
  //   } catch (err) {
  //     console.log("error----------------", err);
  //   }
  // };

  const triggerClick = () => {
    fileRef.current.click();
    setFileFlag(true);
  };

  const checkStatus = () => {
    // setCurrentPage(currentPage + 1);
    setCheckStatusMessage([]);
    setSuccessList([]);
    setFailedList([]);
    callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.CHECK_STATUS_CALL}/${localStorage.getItem(
        "USER_ID"
      )}/1/0`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    )
      .then(async (response) => {
        // finalResponse.push(response);
        console.log("resp ####", response);
        if (response.status === CONSTANTS.STATUS.OK) {
          setShowSuccess(true);
          setCurrentPageCount(response.totalCount);
          setCheck_Status(true);
          setMesssage(response?.message || response?.statusMessage);
          setTotalUploadCount(response?.data[0]?.successListCount);
          setTotalFailedCount(response?.data[0]?.recordingNotPresentListCount);
          setAlreadyExistCount(response?.data[0]?.alreadyListCount);
          setSuccessFile(response?.data[0]?.failedList);
          setSuccessFile1(response?.data[0]?.alreadyList);
          setGetStatus(response?.data[0]?.status);
          setStatusDate(response?.data[0]?.activityDate);
          setStatusError(response?.data[0]?.error);
          setCheckStatusMessage(response?.data[0]?.metaFileName);
          setSuccessList(
            response?.data[0]?.uploadedlist?.filter((e) => {
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
        console.log("error", error);
      });
  };

  const onNext = async () => {
    setCheckStatusMessage([]);
    setSuccessList([]);
    setFailedList([]);
    await setCurrentPage(() => {
      return currentPage + 1;
    });
    callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.CHECK_STATUS}/${localStorage.getItem("USER_ID")}/1/${
        currentPage + 1
      }`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    )
      .then(async (response) => {
        // finalResponse.push(response);
        if (response.status === CONSTANTS.STATUS.OK) {
          setCheck_Status(true);
          setMesssage(response?.message || response?.statusMessage);
          setTotalUploadCount(response?.data[0]?.successListCount);
          setTotalFailedCount(response?.data[0]?.recordingNotPresentListCount);
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
        console.log("error define", error);
      });
  };

  const onPrevious = async () => {
    setCheckStatusMessage([]);
    setSuccessList([]);
    setFailedList([]);
    await setCurrentPage(() => {
      return currentPage - 1;
    });
    callRecordAjax(
      CONSTANTS.API_METHODS.GET,
      `${CONSTANTS.API.CHECK_STATUS}/${localStorage.getItem("USER_ID")}/1/${
        currentPage - 1
      }`,
      {},
      { id: localStorage.getItem("USER_ID") },
      {}
    )
      .then(async (response) => {
        // finalResponse.push(response);
        console.log("resp ####", response);
        if (response.status === CONSTANTS.STATUS.OK) {
          setCheck_Status(true);
          setMesssage(response?.message || response?.statusMessage);
          setTotalUploadCount(response?.data[0]?.successListCount);
          setTotalFailedCount(response?.data[0]?.recordingNotPresentListCount);
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
        console.log("error", error);
      });
  };

  const download_success_data = () => {
    console.log("success ------------", successList);
    const csvContent = ["Success List"].concat(successList).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    console.log("success ------------", successList);

    try {
      let a = window.document.createElement("a");
      a.href = url;
      // a.href = 'data:application/octet-stream,' + encodeURIComponent(`${successList.join('\n')}`);
      a.download = "Uploaded Records.csv";
      a.click();
    } catch (err) {
      console.log("error Uploaded Records----------------", err);
    }
  };
  const download_failed_data = () => {
    console.log("failed ------------", failedList);
    const csvContent = ["Failed List"].concat(failedList).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    console.log("success ------------", failedList);
    try {
      let a = window.document.createElement("a");
      a.href = url;
      // a.href = 'data:application/octet-stream,' + encodeURIComponent(`${failedList.join('\n')}`);
      a.download = "Failed Records.csv";
      a.click();
    } catch (err) {
      console.log("error Failed Records----------------", err);
    }
  };

  return (
    <>
      <div className="content">
        <div className="centrecontent">
          <div className="headerline">
            <div className="headertag">
              <b>Call Records</b>
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
                  disabled={localStorage.getItem("IS_ADMIN") !== "admin"}
                  onDropDownChange={(e) => {
                    // e.target.name =
                    onCallCenterChange(e);
                  }}
                />
                {errorCallCenter ? (
                  <small className="text-danger font-weight-bold">
                    Please select category
                  </small>
                ) : (
                  ""
                )}
              </div>
              <div className="recordsDropdown">
                <RegularDropdown
                  id="selectMetaFile"
                  name="Select Meta File"
                  value={metaFile}
                  labelText=""
                  styleClass="reports_dropdown"
                  // dropdownLabel={"Call Centre"}
                  options={metaFileData}
                  onDropDownChange={(e) => {
                    onMetaFileChange(e);
                  }}
                />
                {errorMetaFile ? (
                  <small className="text-danger font-weight-bold">
                    Please select Meta File
                  </small>
                ) : (
                  ""
                )}
              </div>
              {/* <div className="recordsTextbox">
                                <RegularTextBox
                                    textLabel="S3 Location"
                                    required="" 
                                    placeholder="S3 Location"
                                    name="S3 Location"
                                    id="S3 Location"
                                    value={s3Url}
                                    onChange={(e) => { onS3UrlChange(e); }}

                                />
                                {errorS3Url ? <small className="text-danger font-weight-bold">Please enter s3 path</small> : ''}
                            </div> */}
            </div>
            <div className="col-sm-7 dragAndDropPart">
              <div className="dropzone">
                {/* <Dropzone
                  onDrop={(acceptedFiles) => {
                    onFileSelect(acceptedFiles);
                  }}
                  onFileDialogOpen={() => {
                    setFileFlag(true);
                  }}
                  onFileDialogCancel={() => {
                    setFileFlag(false);
                  }}
                  onDragEnter={() => {
                    setFileFlag(true);
                  }}
                  onDragLeave={() => {
                    setFileFlag(false);
                  }}
                  // accept="audio/WAV,audio/MP3,audio/vox,audio/gsm"
                  accept=".wav, .mp3, .vox, .gsm"
                  // maxFiles="2001"
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div
                        {...getRootProps({
                          // onClick: Event => setFileFlag(true)
                        })}
                      >
                        
                      </div>
                    </section>
                  )}
                </Dropzone> */}
                {/* <input id="fileInput" {...getInputProps()} />
                        <div
                          className="dropFont "
                        >
                          <b className="adjust">
                            <div className="pr-3">
                              <img
                                src={document}
                                alt="document"
                                className="img-responsive"
                              />
                            </div>
                            <p>
                              Drop your files here or{" "}
                              Browse
                            </p>
                          </b>
                        </div> */}
                <input
                  type="file"
                  class="d-none"
                  id="fileInput"
                  onChange={onFileSelect}
                  multiple
                  ref={fileRef}
                  accept=".wav, .mp3, .vox, .gsm"
                />
                <div onClick={triggerClick} className="dropFont ">
                  <b className="adjust">
                    <div className="pr-3">
                      <img
                        src={document}
                        alt="document"
                        className="img-responsive"
                      />
                    </div>
                    {/* <p>Browse files</p> */}
                    <p>
                      Drop your files here or <b className="browse">Browse</b>
                    </p>
                  </b>
                </div>
              </div>
              {!newFileList ? (
                <div className="textDropzone">
                  <b>Please Add call record files</b>
                </div>
              ) : // <div className="textDropzoneFile">
              //     {/* {thumbs} */}
              // </div>
              null}

              {fileloading ? (
                <div className="d-flex">
                  <p className="ml-2 mt-2 mr-2">{`Total Count - ${count}`}</p>{" "}
                  <p className="ml-2 mt-2 mr-2">{`Uploaded - ${fileCount}`}</p>{" "}
                  <p className="ml-2 mt-2 mr-2">{`Failed - ${failedCount}`}</p>
                </div>
              ) : null}
              {errorFile ? (
                <small className="text-danger font-weight-bold justify-items-center">
                  Please select WAV file
                </small>
              ) : (
                ""
              )}
            </div>
            {newFileList && fileFlag == false ? (
              <div className="recordValidationbtn">
                {fileloading ? (
                  <div
                    class="spinner-border text-danger ml-3 mb-1"
                    role="status"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <Button
                    styleClass="standardButton checkStatusButton"
                    text="Upload Call Records"
                    onClick={() => {
                      onUploadRecordClick();
                    }}
                  />
                )}
              </div>
            ) : (
              ""
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
              ""
            )}
            {proceedFlag ? (
              <Button
                styleClass="standardButton checkStatusButton"
                text="Proceed"
                onClick={() => {
                  setCheckStatusFlag(true);
                  dbUpload(fileValues);
                }}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        {checkStatusFlag ? (
          <div className="check-status-button">
            <Button
              styleClass="standardButton checkStatusButton"
              text="Check Status"
              onClick={() => {
                checkStatus();
              }}
            />
          </div>
        ) : (
          ""
        )}
        {showSuccess && (
          <div className="middlehalf1">
            <div className="mainAlertBox" role="alert">
              <p className="alertBox">
                <b className="alertFont1">{messsage}</b>
              </p>
              <p className="alertBox">
                <b className="alertFont1">{checkStatusMessage}</b>
              </p>
            </div>
          </div>
        )}
        {check_Status && (
          <>
            <div className="middlehalf">
              <div class="cardStyle">
                <div>
                  <h5 class="textStyle ">
                    <b>Status</b>
                  </h5>
                  <p class="card-text textStyle">{getStatus}</p>
                </div>
              </div>
              <div class="cardStyle">
                <div>
                  <h5 class=" textStyle">
                    <b>Date & Time</b>
                  </h5>
                  <p class="card-text textStyle">{statusDate}</p>
                </div>
              </div>
              <div class="cardStyle" onClick={() => download_success_data()}>
                <div>
                  <h5 class="textStyle">
                    <b>Total Call Records Uploaded</b>
                  </h5>

                  <p class="card-text textStyle">
                    {totalUploadCount}
                    <img className=" mb-2 downloadIcon " src={FileUpload} />
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
                  <p class="card-text" style={{ color: "red" }}>
                    {statusError}
                  </p>
                </div>
              </div>
              <div class="cardStyle">
                <div>
                  <h5 class=" textStyle">
                    <b>Recording Not Present in Meta File</b>
                  </h5>
                  {/* <img className="ml-1 fileUpload" src={FileUpload} alt="Download" /> */}
                  <p class="card-text textStyle">
                    {totalFailedCount}
                    <img
                      className=" mb-2 downloadIcon "
                      onClick={() => download_failed_data()}
                      src={FileUpload}
                    />
                  </p>
                </div>
              </div>
              <div class="cardStyle">
                <div>
                  <h5 class="textStyle">
                    <b>Recording File already uploaded</b>
                    {/* <img className=" mb-2 downloadIcon " src={FileUpload} /> */}
                  </h5>
                  <p class="card-text textStyle">{alreadyExistsCount}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* {check_Status && (
          <>
            <div className="check-status-button">
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
            </div>
          </>
        )} */}
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

export default CallRecords;
