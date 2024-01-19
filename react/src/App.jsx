import React from "react";
import Header from "./components/Header";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="App">
      <Header />
      <Layout>{/* Main content goes here */}</Layout>
    </div>
  );
}

export default App;
