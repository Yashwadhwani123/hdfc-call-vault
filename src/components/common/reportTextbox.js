import PropTypes from 'prop-types';
import React from 'react';
import '../../stylesheets/common/reporttextbox.css';
const ReportTextBox = (props) => {
    const {
        id, styleClass, disabled, 
        // textLabel,
         onChange, name, value, placeholder, type, accept, onBlur
    } = props;
    return (
        <div className={'newtextLabel123'}>
            <input
                id={id}
                type={type}
                className={styleClass}
                style={{ 'grid-area': `${id}` }}
                name={name || id}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
                accept={accept}
            />
        </div>
    );
};
export default ReportTextBox;
ReportTextBox.propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    styleClass: PropTypes.string,
    name: PropTypes.string,
    textLabel: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.string,
    type: PropTypes.string,
    accept: PropTypes.string
};
ReportTextBox.defaultProps = {
    disabled: false,
    id: '',
    styleClass: 'form-control12 custom-style-input-regular123',
    name: '',
    value: '',
    placeholder: '',
    type: 'text',
    accept: '',
    onChange: () => {
    },
    onBlur: () => {
    },
};