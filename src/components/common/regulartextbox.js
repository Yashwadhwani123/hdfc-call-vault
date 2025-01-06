import PropTypes from 'prop-types';
import React from 'react';
import '../../stylesheets/common/regulartextbox.css';
const RegularTextBox = (props) => {
  const {
    id,
    styleClass,
    disabled,
    // textLabel,
    onChange,
    name,
    value,
    placeholder,
    type,
    accept,
    onBlur,
  } = props;
  return (
    // <div className={'newtextLabel'}>// remove this class because of double textboxes
    <div className={'metadataTextBox'}>
      <input
        id={id}
        // type={type}
        className={styleClass}
        // style={{ 'grid-area': `${id}` }}
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
export default RegularTextBox;
RegularTextBox.propTypes = {
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
  accept: PropTypes.string,
};
RegularTextBox.defaultProps = {
  disabled: false,
  id: '',
  styleClass: 'form-control custom-style-input-regular',
  name: '',
  value: '',
  placeholder: '',
  type: 'text',
  accept: '',
  onChange: () => {},
  onBlur: () => {},
};
