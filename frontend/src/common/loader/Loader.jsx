import React from "react";
import "./Loader.css"; // Import the CSS for the loader

export default function Loader() {
    return (
        <div className="loader-container">
            <div className="sandclock"></div>
            <div className="loading-text">Loading...</div>
        </div>
    );
}