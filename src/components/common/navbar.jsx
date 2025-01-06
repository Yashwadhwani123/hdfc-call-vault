import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../stylesheets/common/navbar.css';
import userAjax from '../../utils/userAjax';
import CONSTANTS from '../../utils/constants';
// import ProfileImage from '../../images/Ellipse 16.svg'

const Navbar = () => {
    // const [hidenav, setHidenav] = useState(false);
    const logout = async() => {
        let params ={
            userId: localStorage.getItem('USER_ID')
        }
          const response = await userAjax(CONSTANTS.API_METHODS.GET, CONSTANTS.API.LOGOUT, params, { id: localStorage.getItem("USER_ID") }, {});
          console.log("response",response);
        localStorage.clear();
        window.location.href = '/';
    };

    const [logoutbutton , setLogoutbutton] = useState(false);
    const [respbuttons, setRespButtons] = useState(false);
    return (
        <div className="navbar-main">
            <nav className="navbar navbar-expand-lg navbar-light">
                <button
                    className="navbar-toggler"
                    onClick={() => {
                        let value = respbuttons == true ? false : true;
                        setRespButtons(value)
                   }}
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                {/* <button className="notify-icon mr-2">
                    <div className="notify-icon-img" />
                </button> */}

                <div className="collapse navbar-collapse " id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto collapse-nav">
                        <div className='button-container'>
                        <li className="nav-item dropdown mr-2 text-light d-flex flex-column align-items-center">

                            <div
                                className="nav-link dropdown-toggle nav-profile text-center" href="#"
                                onClick={() => {
                                    // setHidenav(true);
                                    
                                    let value = logoutbutton == true ? false : true;
                                    setLogoutbutton(value)
                                }}
                                // href="#"
                                id="navbarDropdown"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {/* <img className="mr-3 mb-1" src={ProfileImage}/> */}
                {localStorage.getItem('USER_NAME')}
                            </div>
                            <div className="dropdown-menu dropdown-collapse" aria-labelledby="navbarDropdown">
                                {/* <a className="dropdown-item" href="#">
                  Change User
                                </a>
                                <a className="dropdown-item" href="#">
                  Another action
                                </a> */}
                                {/* <div className="dropdown-divider" /> */}
                                <a className="dropdown-item"  href={CONSTANTS.PATHS.LOGIN} onClick={logout}>
                                    
                  Log out
                                </a>
                                
                            </div>
                           
                           
                        </li>
                        {logoutbutton ?  <button className='logout-button' onClick={logout} href={CONSTANTS.PATHS.LOGIN}>Logout</button>
                             : null }
                             </div>
                            
                             
                    </ul>
                    
                </div>
                {
                                 respbuttons ? <div className='responsive-items'>
                                 <Link to="/call-record">
                                     <li>
                                   
                                         <button className="collapse-buttons">Call Records</button>
                                     </li>
                                 </Link>
                                 <Link to="/metadata-record">
                                     <li>
                                   
                                         <button className="collapse-buttons">Metadata Records</button>
                                     </li>
                                 </Link>
                                 <Link to="/download-record">
                                     <li>
                                         <button className="collapse-buttons">
                           Download Call Records
                                         </button>
                                     </li>
                                 </Link>
                                 <Link to="/reports">
                                     <li>
                                         <button className="collapse-buttons">Reports</button>
                                     </li>
                                 </Link>
                                 <Link to="/rolemanagement">
                                     <li>
                                         <button className="collapse-buttons">Role Management</button>
                                     </li>
                                 </Link>
                                 <Link to="/user">
                                     <li>
                                         <button className="collapse-buttons">User Master</button>
                                     </li>
                                 </Link>
                                 <Link to="/callcentre">
                                     <li>
                                         <button className="collapse-buttons">Call Centers</button>
                                     </li>
                                 </Link>
                                 </div>
                                 : null
                                 
                             }
            </nav>
        </div>
    );
};

export default Navbar;
