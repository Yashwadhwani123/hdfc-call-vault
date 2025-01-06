import React from 'react';
import Entry from './entry';
import Button from './button';
import FaceBookImage from '../../images/facebook.png';
import '../../stylesheets/common/footer.css';

export default function Footer() {
    return (
        <>
            <div className="footerContainer">
                <div className="footer">
                    <div className="leftFooter">
                        <h1 className="subscribeHeading">Subscribe to AdobeXD via Email</h1>
                        <h2 className="subscribeSubheading">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia</h2>
                        <Entry id="emailAddress" />
                        <Button id="subscribe" />
                    </div>
                    <div className="rightFooter">
                        <div className="list1">
                            <h3>+44 345 678 903</h3>
                            <h3>ADOBEXD@MAIL.COM</h3>
                            <h3>FIND A STORE</h3>
                        </div>
                        <div className="list2">
                            <h3>CONTACT US</h3>
                            <h3>ORDERING & PAYMENT</h3>
                            <h3>SHIPPING</h3>
                            <h3>RETURNS</h3>
                            <h3>FAQ</h3>
                            <h3>SIZING GUIDE</h3>
                        </div>
                        <div className="list3">
                            <h3>ABOUT ADOBE XD KIT</h3>
                            <h3>WORK WITH US</h3>
                            <h3>PRIVACY POLICY</h3>
                            <h3>TERMS & CONDITIONS</h3>
                            <h3>PRESS ENQUIRIES</h3>
                        </div>
                    </div>
                </div>
                {/* <div className="subFooter">
                    <h1>© AdobeXD Kit 2017</h1>
                    <div className="socialMediaLinks">
                        <img
                            src="FaceBookImage"
                            alt=""
                            srcSet=""
                        />
                        <img src="" alt="" srcset="" />
                        <img src="" alt="" srcset="" />
                    </div>
                </div> */}
            </div>
        </>
    );
}
