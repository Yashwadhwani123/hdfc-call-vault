/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import '../../stylesheets/common/table.css';

const Table = (props) => {
    const renderHeaders = () => {
        const { headers } = props;
        return headers.map((x) => (<th>{x}</th>));
    };

    const renderData = () => {
        const { bodyData } = props;
        return bodyData.map((x) => (
            <tr key={x.id}>
                {Object.keys(x).map((y) => (
                    <td>{x[y]}</td>
                ))}
            </tr>
        ));
    };

    return (
        <>
            <table className="standardTable">
                <thead>
                    {renderHeaders()}
                </thead>
                {renderData()}
            </table>
        </>
    );
};

Table.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    // bodyData: PropTypes.arrayOf(PropTypes.shape())
};

export default Table;
