import React, { Component } from 'react';
import '../../stylesheets/common/entry.css';
import PropTypes from 'prop-types';

export default class Textbox extends Component {
    shouldComponentUpdate(nextProps) {
        const { value, error } = this.props;
        if (value === nextProps.value && error === nextProps.error) {
            return false;
        }
        return true;
    }

    render() {
        const {
            id, styleClass, inputType, disabled, placeholder, value, textChange, error, onBlur, onInput, onKeyPress, name,
            //  divStyle,
        } = this.props;
        return (
            <>
                {/* <div className={` ${divStyle || ''}`}> */}
                <input
                    className={` ${styleClass || ''} ${error ? 'errorBorder' : ''}`}
                    type={inputType}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={textChange}
                    ref="input"
                    value={value}
                    id={id}
                    name={name}
                    // maxLength="number"
	                     onInput={onInput}
                    onBlur={onBlur}
                    onKeyPress={onKeyPress}
                />
                {/* </div> */}
            </>
        );
    }
}

Textbox.propTypes = {
    textChange: PropTypes.func.isRequired,
    value: PropTypes.instanceOf(['String', 'integer']).isRequired,
    error: PropTypes.bool,
};
