// Layout.jsx;

import React from "react";

const Layout = ({ children }) => {
  return (
    <main>
      {/* <img
        src="https://www.travel-experience-live.com/wp-content/uploads/2020/10/Arches-National-Park-Banner-Landscape-Arch.jpg?x16834"
        alt="Landscape Arch at Arches National Park"
        className="banner-image"
      /> */}
      {children}
      <div className="photo-container">{/* Photos will be added here */}</div>
    </main>
  );
};

export default Layout;
