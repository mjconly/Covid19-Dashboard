import React from 'react';
import Atlas from "./Components/Atlas";
import "./App.css"

function App() {
  return (
    <div className="map-container">
      <div id="mapid">
          <Atlas></Atlas>
      </div>
    </div>
  );
}

export default App;
