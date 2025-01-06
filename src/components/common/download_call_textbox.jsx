import React from 'react'
import '../../stylesheets/common/textbox.css';
import PropTypes from 'prop-types';

const Download_call_textbox = (props) => {
    const {
        id, styleClass, disabled, textLabel, onChange, name, value, placeholder, type, accept, onBlur
    } = props;
  return (
    <div className={disabled ? 'textLabel2 disabledStyle' : 'textLabel2'}>
            <label>{textLabel}</label>
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
            />
        </div>
  )
}

export default Download_call_textbox