import React from "react";

const ShareToast = ({ message, visible }) => {
  if (!visible) return null;

  return <div className="share-toast">{message}</div>;
};

export default ShareToast;
