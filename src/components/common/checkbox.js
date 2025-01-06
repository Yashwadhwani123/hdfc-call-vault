import PropTypes from 'prop-types';
import React, { useState } from 'react';
import '../../stylesheets/common/checkbox.css';

const Checkbox = (props) => {
    const [isChecked, setIsChecked] = useState(false);
    const {
        id, text, onClick, defaultCheck, textStyle,
    } = props;

    const onButtonClick = (e) => {
        setIsChecked(!isChecked);
        onClick(e);
    };

    return (
        <>
            <div
                className="standardCheckBox"
                style={{ gridArea: `${id}` }}
            >
                <input
                    type="checkbox"
                    name="checkbox"
                    id={id}
                    value={defaultCheck}
                    onClick={onButtonClick}
                />
                <button
                    className={textStyle}
                    type="button"
                    onClick={onButtonClick}
                >
                    {text}
                </button>
            </div>
        </>
    );
};

Checkbox.propTypes = {
    defaultCheck: PropTypes.bool.isRequired,
    id: PropTypes.string,
    text: PropTypes.string,
    textStyle: PropTypes.string,
    onClick: PropTypes.func,
};

Checkbox.defaultProps = {
    id: '',
    text: '',
    textStyle: 'checkBoxText standardTextColor',
    onClick: () => {

    },
};

export default Checkbox;
