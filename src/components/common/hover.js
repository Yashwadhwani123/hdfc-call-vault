import React from 'react';
import PropTypes from 'prop-types';
import '../../stylesheets/common/hover.css';

const Hover = (props) => {
    const { children, modalBackgroundColor } = props;
    return (
        <>
            <div
                className="hoverContainer"
                style={{ backgroundColor: modalBackgroundColor }}
            >
                {children}
            </div>
        </>
    );
};

Hover.propTypes = {
    children: PropTypes.node.isRequired,
    modalBackgroundColor: PropTypes.string,
};

Hover.defaultProps = {
    modalBackgroundColor: '#0006',
};

export default Hover;
