import React from 'react';
import '../stylesheets/notfound.css';

const NotFound = () => (
    <>
        <div className="Four04Container">
            <div className="Four04Text">
                404
            </div>
            <div className="title">
                Page Not Found
            </div>
            <div className="subtitle">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.</div>
            <button className="standardButton standardDarkButton" type="button">GO TO HOME</button>
        </div>
    </>
);

NotFound.propTypes = {

};

export default NotFound;
