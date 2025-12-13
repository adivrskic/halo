import React from "react";

const ControlGroup = ({ label, valueLabel, children, hint }) => {
  return (
    <div className="control-group">
      <div className="control-label">
        <span className="label-text">{label}</span>
        {valueLabel !== undefined && (
          <span className="label-value">{valueLabel}</span>
        )}
      </div>
      {children}
      {hint && <div className="hint-text">{hint}</div>}
    </div>
  );
};

export default ControlGroup;
