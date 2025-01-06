import PropTypes from 'prop-types';
import React from 'react';
import '../../stylesheets/common/textbox.css';
const TextBox = (props) => {
    const {
        id, styleClass, disabled, textLabel, onChange, name, value, placeholder, type, accept, onBlur
    } = props;
    return (
        <div className={disabled ? 'textLabel disabledStyle' : 'textLabel'}>
            <label >{textLabel}</label>
            <input
                id={id}
                type={type}
                className={styleClass}
                style={{ 'grid-area': `${id}`, position: 'relative' }}
                name={name || id}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
                accept={accept}
                autoComplete='new-password'
            />
        </div>
    );
};
export default TextBox;
TextBox.propTypes = {
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
TextBox.defaultProps = {
    disabled: false,
    id: '',
    styleClass: 'form-control custom-style-input',
    name: '',
    textLabel: '',
    value: '',
    placeholder: '',
    type: 'text',
    accept: '',
    onChange: () => {
    },
    onBlur: () => {
    },
};
