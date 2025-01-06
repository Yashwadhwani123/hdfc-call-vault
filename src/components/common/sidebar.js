import React, { PureComponent } from 'react';
import '../../stylesheets/common/sidebar.css';
import CONSTANTS from '../../utils/constants';
import encryptData from './crypto';

export default class Sidebar extends PureComponent {
  render() {
    let permission = JSON.parse(encryptData(localStorage.getItem('ENCRYPTED_DATA'), 'dec'));
    return (
      <>
        <div className="sidebarContainer">
          <div className="sidebarLogo" />

          <div className="list">
            {permission?.callRecords?.view === true ? (
              <a className={` my-auto h-100 align-middle ${window.location.pathname === CONSTANTS.PATHS.METADATA_RECORD ? 'activeNav' : ''}`} href={CONSTANTS.PATHS.METADATA_RECORD}>
                <button type="button">
                  <div className="metadata-records-icon mr-2" /> Metadata Records
                </button>
              </a>
            ) : (
              ''
            )}
            {permission?.callRecords?.view === true ? (
              <a className={` my-auto h-100 align-middle ${window.location.pathname === CONSTANTS.PATHS.CALL_RECORD ? 'activeNav' : ''}`} href={CONSTANTS.PATHS.CALL_RECORD}>
                <button type="button">
                  <div className="call-records-icon mr-2" /> Call Records
                </button>
              </a>
            ) : (
              ''
            )}
            {permission?.downloadCallRecords?.view === true ? (
              <a className={` my-auto h-100 align-middle ${window.location.pathname === CONSTANTS.PATHS.DOWNLOAD_RECORD ? 'activeNav' : ''}`} href={CONSTANTS.PATHS.DOWNLOAD_RECORD}>
                <button type="button">
                  <div className="downloadcall-records-icon  mr-2" /> Download Call Records
                </button>
              </a>
            ) : (
              ''
            )}
            {permission?.reports?.view === true ? (
              <a className={` my-auto h-100 align-middle ${window.location.pathname === CONSTANTS.PATHS.REPORTS ? 'activeNav' : ''}`} href={CONSTANTS.PATHS.REPORTS}>
                <button type="button">
                  <div className="reports-icon mr-2" /> Reports
                </button>
              </a>
            ) : (
              ''
            )}
            {permission?.roleManagement?.view === true ? (
              <a className={` my-auto h-100 align-middle ${window.location.pathname === CONSTANTS.PATHS.ROLEMANAGEMENT ? 'activeNav' : ''}`} href={CONSTANTS.PATHS.ROLEMANAGEMENT}>
                <button type="button">
                  <div className="roll-manage-icon mr-2" /> Role Management
                </button>
              </a>
            ) : (
              ''
            )}
            {permission?.userMaster?.view === true ? (
              <a className={` my-auto h-100 align-middle ${window.location.pathname === CONSTANTS.PATHS.USER ? 'activeNav' : ''}`} href={CONSTANTS.PATHS.USER}>
                <button type="button">
                  <div className="user-master-icon mr-2" /> User Master
                </button>
              </a>
            ) : (
              ''
            )}
            {permission?.callCenter?.view === true ? (
              <a className={` my-auto h-100 align-middle ${window.location.pathname === CONSTANTS.PATHS.CALLCENTRE ? 'activeNav' : ''}`} href={CONSTANTS.PATHS.CALLCENTRE}>
                <button type="button">
                  <div className="call-centre-icon mr-2" /> Call Centers
                </button>
              </a>
            ) : (
              ''
            )}
          </div>
        </div>
      </>
    );
  }
}
