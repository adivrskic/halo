import React from "react";

const IconButton = ({
  children,
  onClick,
  title,
  active = false,
  className = "",
  href,
  ...props
}) => {
  const baseClasses = `icon-link ${active ? "active" : ""} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        title={title}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick} title={title} {...props}>
      {children}
    </button>
  );
};

export default IconButton;
