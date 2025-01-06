import React from 'react';
import '../../stylesheets/header.css';

export default function Header() {
    return (
        <>
            <div className="headerContainer">
                <input
                    type="text"
                    name="searchbar"
                    id="searchbar"
                    placeholder="Search transactions, invoices or help"
                />
            </div>
        </>
    );
}
