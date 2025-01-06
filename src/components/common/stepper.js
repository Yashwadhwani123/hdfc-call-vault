import PropTypes from 'prop-types';
import React from 'react';
import '../../stylesheets/common/stepper.css';

const Stepper = ({ count }) => {
    const renderStepsAndBars = () => {
        const aa = [];
        for (let i = 0; i < count; i += 1) {
            aa.push((
                <>
                    <div className="stepContainer">
                        <div className="step">
                            {i + 1}
                        </div>
                        <div className="stepText">
                            {`Step ${i + 1}`}
                        </div>
                    </div>
                    {i === count - 1
                        ? null
                        : <div className="bar" />}
                </>
            ));
        }
        return aa;
    };


    return (
        <>
            <div className="stepper">
                {renderStepsAndBars()}
            </div>
        </>
    );
};

Stepper.propTypes = {
    count: PropTypes.number,
};

Stepper.defaultProps = {
    count: 2,
};

export default Stepper;
