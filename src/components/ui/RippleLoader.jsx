import React from "react";

const RippleLoader = ({ visible }) => {
  return (
    <div className={`loader-overlay ${visible ? "" : "fade-out"}`}>
      <div className="loader">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <p className="logo">HALO</p>
      </div>
    </div>
  );
};

export default RippleLoader;
