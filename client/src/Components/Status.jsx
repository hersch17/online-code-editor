import React from "react";
import "../styles/status.css";
const Status = ({ outputDetails }) => {
  return (
    <div className="status-box">
      <p className="parameter">
        Status:{" "}
        <span className="text-highlight">
          {outputDetails?.status?.description}
        </span>
      </p>
      <p className="parameter">
        Memory:{" "}
        <span className="text-highlight">
          {outputDetails?.memory}
        </span>
      </p>
      <p className="parameter">
        Time:{" "}
        <span className="text-highlight">
          {outputDetails?.time}
        </span>
      </p>
    </div>
  );
};

export default Status;
