import React from 'react';
import Atlas from "./Components/Atlas";
import Charts from "./Components/Charts"

import "./App.scss"

function App() {
  return (
    <div className="main-container">
      <div className="map-container">
          <Atlas></Atlas>
      </div>
      <Charts></Charts>
    </div>
  );
}

export default App;
