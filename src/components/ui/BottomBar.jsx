import React from "react";
import IconButton from "./IconButton";
import { Circle, X, Github, Share2 } from "lucide-react";

const BottomBar = ({
  titleVisible,
  controlsVisible,
  onShare,
  onToggleControls,
}) => {
  return (
    <div className="bottom-bar">
      <div className={`app-title ${titleVisible ? "visible" : ""}`}>
        <div className="title-text">
          <Circle /> HALO
        </div>
      </div>

      <div className={`bottom-bar-right ${titleVisible ? "visible" : ""}`}>
        <IconButton
          onClick={onShare}
          title="Copy share link"
          style={{ "--index": 0 }}
        >
          <Share2 />
        </IconButton>

        <IconButton
          href="https://github.com/adivrskic"
          title="GitHub"
          style={{ "--index": 1 }}
        >
          <Github />
        </IconButton>

        <IconButton
          onClick={onToggleControls}
          active={controlsVisible}
          className="control-button"
          title={controlsVisible ? "Close controls" : "Open controls"}
          style={{ "--index": 2 }}
        >
          {controlsVisible ? <X /> : <Circle />}
        </IconButton>
      </div>
    </div>
  );
};

export default BottomBar;
