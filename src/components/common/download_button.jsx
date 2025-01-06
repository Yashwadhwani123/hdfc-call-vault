import PropTypes from 'prop-types';
import React from 'react';
import '../../stylesheets/common/button.css';
import Upload from "./../../images/Icon feather-upload.svg";
import PlayRecording from "./../../images/Icon ionic-ios-play-circle.svg";

const Download_Button = (props) => {
    const {
        id, text, styleClass, onClick, disabled,src
    } = props;
    return (
        <button
            id={id}
            type="button"
            className={styleClass}
            style={{ 'grid-area': `${id}` }}
            onClick={onClick}
            disabled={disabled}
        >
            <span>{text}</span>
           <img className='mb-1' src={src}></img>
        </button>
    );
};

export default Download_Button;

Download_Button.propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    text: PropTypes.string,
    styleClass: PropTypes.string,
    onClick: PropTypes.func,
};

Download_Button.defaultProps = {
    disabled: false,
    id: '',
    text: 'Button',
    styleClass: 'standardButton standardDarkButton',
    onClick: () => {

    },
};
