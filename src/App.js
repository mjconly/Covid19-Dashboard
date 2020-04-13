import React from 'react';
import Atlas from "./Components/Atlas";

import "./App.scss"

function App() {
  return (
    <div className="main-container">
      <div className="map-container">
          <Atlas></Atlas>
      </div>
    </div>
  );
}

export default App;
