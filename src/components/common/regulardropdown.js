import React from "react";
import PropTypes from "prop-types";
import "../../stylesheets/common/regulardropdown.css";
import "../../stylesheets/common/regulartextbox.css";

import isEmpty from "../../utils/isEmpty";

const RegularDropdown = (props) => {
  const {
    onBlur,
    onDropDownSelect,
    styleClass,
    id,
    disabled,
    options=[],
    onDropDownChange,
    labelText,
    isRequired,
    value,
    name,
  } = props;
  const renderOptions = () =>
    options.map((option, index) => (
      <option
        key={option.id + "_" + index}
        id={option.id + "_" + index}
        value={option.id}
        selected={option.id}
      >
        {option.name}
      </option>
    ));

  return (
    <div className="newtextLabel selectAddNew newselectdiv">
        {/* {!isEmpty(labelText.length) ? (
          <div className="labelDiv">
            <div className="entrylabel mt-3 ">
              <label for={id}>{labelText}</label>
              {isRequired ? <span style={{ color: "red" }}>*</span> : null}
            </div>
          </div>
        ) : null} */}

      <select
        id={id}
        onChange={onDropDownChange}
        onBlur={onBlur}
        onFocus={onDropDownSelect}
        className={styleClass}
        disabled={disabled}
        value={value}
        name={name || id}
      >
        <option value="" className='custom-color'>{name}</option>
        {renderOptions()}
      </select>
    </div>
  );
};

RegularDropdown.propTypes = {
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

RegularDropdown.defaultProps = {
  styleClass: "form-control custom-style-input-regular",
  disabled: false,
  name: "",
  value: "male",

  onDropDownChange: () => {},
  onDropDownSelect: () => {},
  onBlur: () => {},
};

export default RegularDropdown;
