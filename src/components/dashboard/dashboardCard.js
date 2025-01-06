import React from 'react';
import PropTypes from 'prop-types';
import '../../stylesheets/dashboardCard.css';

const DashboardCard = (props) => {
    const { header, value } = props;
    return (
        <>
            <div className="cardContainer">
                <div className="header">{header}</div>
                <div className="statsContainer">
                    <div className="stats">
                        <label>{value}</label>
                        <label>{'aksdlakldjaldlaljldjdldkaldkdlkjladkaldkdlakdjladkjaldkajldakdjladkjaldkajldkajldakjdlakdaldkaldk'}</label>
                    </div>
                    <div className="chartContainer" />
                </div>
            </div>
        </>
    );
};

DashboardCard.propTypes = {
    header: PropTypes.string.isRequired,
    value: PropTypes.oneOfType(['string', 'number']).isRequired,
    secodaryValue: PropTypes.oneOfType(['string', 'number']).isRequired,
};

export default DashboardCard;
