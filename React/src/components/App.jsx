import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import AuthContainer from "./AuthContainer";

function App() {
  return (
    <div>
      <Header />
      <AuthContainer />
      <Footer />
    </div>
  );
}

export default App;
