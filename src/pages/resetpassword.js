import React from 'react';
import Button from '../components/common/button';
import Entry from '../components/common/entry';
import '../stylesheets/resetpassword.css';

const ResetPassword = () => (
    <>
        <div className="resetOuterContainer">
            <div id="bgImage" />
            <div className="resetInnerContainer">
                <div className="resetForm">
                    <h1 className="logo">IMPEKABLE</h1>
                    <h1 className="tagline">Enter your email and we will send you a password reset link.</h1>
                    <Entry
                        id="emailID"
                        isFocused
                        placeholder="Email"
                        type="email"
                    />
                    <Button
                        id="signup"
                        styleClass="signupBtn standardButton standardDarkButton"
                        text="Send request"
                        // onClick={login}
                    />
                </div>
                <div className="termsOfUseContainer">
                    <h1
                        className="termsOfUse"
                        type="button"
                    >
                        Terms of use. Privacy policy
                    </h1>
                </div>
            </div>
        </div>
    </>
);

export default ResetPassword;
