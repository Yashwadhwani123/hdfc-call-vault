import React from 'react';
import PropTypes from 'prop-types';
import '../../stylesheets/common/dropdown.css';
import '../../stylesheets/common/textbox.css';

import isEmpty from '../../utils/isEmpty';

const Dropdown = (props) => {
    const {
        // onBlur,
        onDropDownSelect,
        styleClass,
        id,
        disabled,
        options = [],
        onDropDownChange,
        labelText,
        // isRequired,
        dropdownLabel,
    value,
    // name,
    } = props;
    const renderOptions = () => {
        if (options) {
            const data = options.map((option, index) => (
                <option
                    key={`${option.id}_${index}`}
                    id={`${option.id}_${index}`}
                    value={option.id}
                    selected={option.id}
                >
                    {option.name}
                </option>
            ));
            return data;
        }
    };

    return (
        <div className="textLabel selectdiv">
            <label className="">{dropdownLabel}</label>
            {!isEmpty(labelText?.length) ? (
                <div className="labelDiv">
                    <div className="entrylabel mt-3 ">
                        <label htmlFor={id}>{labelText}</label>
                        {/* {isRequired ? <span style={{ color: "red" }}>*</span> : null} */}
                    </div>
                </div>
            ) : null}

            <select
                id={id}
                onChange={onDropDownChange}
                // onBlur={onBlur}
                onFocus={onDropDownSelect}
                className={styleClass}
                disabled={disabled}
                value={value}
                // name={name || id}
            >
                <option value="" className="custom-color">
          Please Select {dropdownLabel}
                </option>
                {renderOptions()}
            </select>
        </div>
    );
};

Dropdown.propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string.isRequired,
    styleClass: PropTypes.string,
    options: PropTypes.arrayOf({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        isDefault: PropTypes.bool.isRequired,
    }).isRequired,
    onDropDownChange: PropTypes.func,
    onDropDownSelect: PropTypes.func,
    onBlur: PropTypes.func,
    dropdownLabel: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
};

Dropdown.defaultProps = {
    styleClass: '',
    disabled: false,
    name: '',
    value: 'male',

    onDropDownChange: () => {},
    onDropDownSelect: () => {},
    onBlur: () => {},
};

export default Dropdown;
