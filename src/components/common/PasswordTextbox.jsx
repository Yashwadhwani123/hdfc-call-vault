import React, { Component } from "react";
import "../../stylesheets/password_textbox.css";
import PropTypes from "prop-types";
import eye from '../../images/eye-fill.svg'
export default class PasswordTextbox extends Component {
  shouldComponentUpdate(nextProps) {
    const { value, error } = this.props;
    if (value === nextProps.value && error === nextProps.error) {
      return false;
    }
    return true;
  }
  showhide = () => {
    const pwd = document.getElementById(this.props.pwdId);
    const eye = document.getElementById(this.props.tooltip);
    eye.classList.toggle("active");
    pwd.type === "password" ? (pwd.type = "text") : (pwd.type = "password");
  };
  render() {
    const {
      styleClass,
      disabled,
      placeholder,
      value,
      textChange,
      error,
      tooltip,
      pwdId,
      eyeClass,
      onBlur,
      onLogin,
    } = this.props;
    return (
      <>
        <div class="input-group mb-3 size">
          <input
            style={{height: '50px'}}
            type="password"
            className="form-control entryinput errorBorder focused"
            aria-describedby="basic-addon2"
            id={pwdId}
            placeholder={placeholder}
                    onChange={textChange}
                    ref="input"
                    value={value}
                    onBlur={onBlur}
                    disabled={disabled}
                    onKeyDown={onLogin}
          />
          <div class="input-group-append">
            <button className="btn btn-outline-secondary" type="button" id={tooltip} title={tooltip} onClick={this.showhide}>
            <img src={eye}></img>
            </button>
          </div>
        </div>
      </>
    );
  }
}
PasswordTextbox.propTypes = {
  textChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(["String", "integer"]).isRequired,
  error: PropTypes.bool,
};