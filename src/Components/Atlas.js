import React, { Component, createRef } from "react";
import { Map, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "../App.css"

class Atlas extends Component{
    constructor(props){
        super(props);

        this.state={
            lat: 30,
            lng: 0,
            zoom: 2,
        }
    }

    componentDidMount(){

    }

    componentWillUnmount(){
       
    }

    render(){
        return(
            <div id="mapId">
                <div
                ref={this.lens} 
                className="lens"
                onMouseDown={this.mouseDown}
                onMouseMove={this.mouseMove}
                onMouseUp={this.mouseUp}
                style={{ 
                    width: "1050px", 
                    height: "700px",
                    }} ></div>
                    <Map
                        ref="map"
                        className="atlas"
                        center={[this.state.lat, this.state.lng]}
                        zoom={this.state.zoom}
                        minZoom={2}
                        maxBoundsViscosity={1}
                        maxBounds={[[90, 200], [-90, -200]]}
                        style={{ 
                            width: "1050px", 
                            height: "700px",
                            transform: `translate(${this.state.transX}px, ${this.state.transY}px)`
                        }}
                    >
                        <TileLayer
                            attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
                            url="https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNvbiIsImEiOiJjazhxd3dqMTgwOG91M2RwZHN3MHlvYnVsIn0.DKv7sGBKWa6QdsFVZzNyNg"
                    />
                    
                    </Map>
            </div>
        )
    }
}

export default Atlas;

