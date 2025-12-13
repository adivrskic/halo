import React from "react";
import ControlGroup from "./ControlGroup";
import SliderControl from "./SliderControl";

const ControlPanel = ({ settings, updateSetting, fonts, visible }) => {
  if (!visible) return null;

  return (
    <div className="control-panel visible">
      <div className="panel-content">
        <ControlGroup
          label="Text"
          valueLabel={settings.text.length + " char(s)"}
        >
          <input
            type="text"
            value={settings.text}
            onChange={(e) => updateSetting("text", e.target.value)}
            placeholder="Enter text..."
            maxLength={20}
          />
        </ControlGroup>

        <ControlGroup label="Color" valueLabel={settings.color}>
          <div className="color-picker">
            <div className="color-swatch">
              <input
                type="color"
                value={settings.color}
                onChange={(e) => updateSetting("color", e.target.value)}
              />
              <div
                className="color-preview"
                style={{ backgroundColor: settings.color }}
              />
            </div>
            <div className="input-wrapper color-input">
              <input
                type="text"
                value={settings.color}
                onChange={(e) => updateSetting("color", e.target.value)}
                placeholder="#ffffff"
              />
            </div>
          </div>
        </ControlGroup>

        <ControlGroup label="Font">
          <select
            value={settings.font}
            onChange={(e) => updateSetting("font", e.target.value)}
            className="font-select"
          >
            {fonts.map((f) => (
              <option key={f.path} value={f.path}>
                {f.name}
              </option>
            ))}
          </select>
        </ControlGroup>

        <SliderControl
          label="Object Scale"
          value={settings.objectScale}
          onChange={(v) => updateSetting("objectScale", v)}
          min={0.1}
          max={3}
          step={0.05}
        />

        <SliderControl
          label="Object X Rotation"
          value={settings.objectRotationX}
          onChange={(v) => updateSetting("objectRotationX", v)}
          min={-180}
          max={180}
          step={1}
          unit="°"
        />

        <SliderControl
          label="Object Y Rotation"
          value={settings.objectRotationY}
          onChange={(v) => updateSetting("objectRotationY", v)}
          min={-180}
          max={180}
          step={1}
          unit="°"
        />

        <SliderControl
          label="Object Z Rotation"
          value={settings.objectRotationZ}
          onChange={(v) => updateSetting("objectRotationZ", v)}
          min={-180}
          max={180}
          step={1}
          unit="°"
        />

        <SliderControl
          label="Orbit Angle"
          value={settings.rotationAngle}
          onChange={(v) => updateSetting("rotationAngle", v)}
          min={0}
          max={360}
          step={1}
          unit="°"
          hint="0° horizontal · 90° vertical"
        />

        <SliderControl
          label="Orbit Height"
          value={settings.orbitY}
          onChange={(v) => updateSetting("orbitY", v)}
          min={-2}
          max={2}
          step={0.05}
        />

        <SliderControl
          label="Orbit Radius"
          value={settings.orbitRadius}
          onChange={(v) => updateSetting("orbitRadius", v)}
          min={0.2}
          max={4}
          step={0.05}
        />

        <SliderControl
          label="Orbit Speed"
          value={settings.speed}
          onChange={(v) => updateSetting("speed", v)}
          min={0}
          max={1.2}
          step={0.01}
        />

        <SliderControl
          label="Letter Spread"
          value={settings.letterSpacing}
          onChange={(v) => updateSetting("letterSpacing", v)}
          min={0.2}
          max={1}
          step={0.05}
          unit="%"
        />

        <SliderControl
          label="Letter Size"
          value={settings.charSize}
          onChange={(v) => updateSetting("charSize", v)}
          min={0.12}
          max={0.6}
          step={0.01}
        />

        <SliderControl
          label="Letter Thickness"
          value={settings.textThickness}
          onChange={(v) => updateSetting("textThickness", v)}
          min={0.02}
          max={0.3}
          step={0.01}
        />

        <SliderControl
          label="Glow Intensity"
          value={settings.glow}
          onChange={(v) => updateSetting("glow", v)}
          min={0}
          max={5}
          step={0.1}
        />

        <ControlGroup
          label="Reverse Direction"
          hint="Flip text orbit direction"
        >
          <div className="toggle-wrapper">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.reverseDirection}
                onChange={(e) =>
                  updateSetting("reverseDirection", e.target.checked)
                }
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </ControlGroup>
      </div>
    </div>
  );
};

export default ControlPanel;
