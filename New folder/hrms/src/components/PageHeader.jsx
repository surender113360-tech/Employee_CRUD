import React from 'react';

const PageHeader = ({ title, sub, subtitle, action }) => {
  const description = sub || subtitle;

  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
