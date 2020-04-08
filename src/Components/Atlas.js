import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";

class Atlas extends Component{
    constructor(props){
        super(props);

        this.state={
            lat: 30,
            lng: 0,
            zoom: 2
        }

        this.onDrag = this.onDrag.bind(this);
    }

    componentDidMount(){

    }

    componentDidUpdate(prevProps){
        
    }

    onDrag(e, m){
        console.log(m.map.leafletElement.getBounds());
    }

    render(){
        return(
            <Map
                ref='map'
                center={[this.state.lat, this.state.lng]}
                zoom={this.state.zoom}
                style={{ width: "60vw", height: "60vh"}}
                zoomControl={false}
                onDrag={(e) => this.onDrag(e, this.refs)}
            >
                <TileLayer
                    attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
                    url="https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNvbiIsImEiOiJjazhxd3dqMTgwOG91M2RwZHN3MHlvYnVsIn0.DKv7sGBKWa6QdsFVZzNyNg"
               />
            
            </Map>
        )
    }
}

export default Atlas;

