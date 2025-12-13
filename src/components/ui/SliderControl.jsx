import React from "react";

const SliderControl = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
  hint,
}) => {
  const displayValue =
    typeof value === "number"
      ? unit === "%"
        ? `${(value * 100).toFixed(0)}%`
        : `${value.toFixed(2)}${unit}`
      : value;

  return (
    <div className="control-group">
      <div className="control-label">
        <span className="label-text">{label}</span>
        <span className="label-value">{displayValue}</span>
      </div>
      <div className="input-wrapper">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      {hint && <div className="hint-text">{hint}</div>}
    </div>
  );
};

export default SliderControl;
