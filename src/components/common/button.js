import PropTypes from 'prop-types';
import React from 'react';
import '../../stylesheets/common/button.css';

const Button = (props) => {
    const {
        id, text, styleClass, onClick, disabled,
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
            {text}
        </button>
    );
};

export default Button;

Button.propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    text: PropTypes.string,
    styleClass: PropTypes.string,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    disabled: false,
    id: '',
    text: 'Button',
    styleClass: 'standardButton standardDarkButton',
    onClick: () => {

    },
};
