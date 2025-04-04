import React from 'react';

export const Tabs = ({ children }) => <div className="tabs">{children}</div>;
export const TabsList = ({ children }) => <div className="tabs-list">{children}</div>;
export const TabsTrigger = ({ value, children }) => (
  <button className="tabs-trigger" data-value={value}>{children}</button>
);
export const TabsContent = ({ value, children }) => (
  <div className="tabs-content" data-value={value}>{children}</div>
);