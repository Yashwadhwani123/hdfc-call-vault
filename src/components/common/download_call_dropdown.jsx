import React from 'react';
import '../../stylesheets/common/regulardropdown.css';
import '../../stylesheets/common/regulartextbox.css';

const Download_call_dropdown = (props) => {
  const { onBlur, onDropDownSelect, styleClass, id, disabled, options = [], onDropDownChange, labelText, isRequired, value, name } = props;
  const renderOptions = () => {
    if (options) {
      const data = options.map((option, index) => (
        <option key={`${option.id}_${index}`} id={`${option.id}_${index}`} value={option.id} selected={option.id}>
          {option.name}
        </option>
      ));
      return data;
    }
  };

  return (
    <div className="buisnesstestLabel download_call_div">
      {/* {!isEmpty(labelText.length) ? (
          <div className="labelDiv">
            <div className="entrylabel mt-3 ">
              <label for={id}>{labelText}</label>
              {isRequired ? <span style={{ color: "red" }}>*</span> : null}
            </div>
          </div>
        ) : null} */}

      <select id={id} onChange={onDropDownChange} onBlur={onBlur} onFocus={onDropDownSelect} className={styleClass} disabled={disabled} value={value} name={name || id}>
        <option value="" className="custom-color">
          {name}
        </option>
        {renderOptions()}
      </select>
    </div>
  );
};

export default Download_call_dropdown;
