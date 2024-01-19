import React from "react";

const Layout = ({ children }) => {
  return (
    <main>
      {children}
      {/* Placeholder for photos */}
      <div className="photo-container">{/* Photos will be added here */}</div>
    </main>
  );
};

export default Layout;
