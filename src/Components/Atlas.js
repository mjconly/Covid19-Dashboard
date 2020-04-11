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
            height: 0,
            width: 0,
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            right: 0,
            bot: 0,
            draggable: false
        }

        this.lens = createRef();

       
        this.mouseIn = this.mouseIn.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.windowSize = this.windowSize.bind(this);
    }

    componentDidMount(){
        window.addEventListener("resize", this.windowSize);
        this.windowSize();
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.windowSize);
    }

    windowSize(){
        const {left, top, right, bottom} = this.lens.current.getBoundingClientRect();

        this.setState({
            top,
            left,
            right,
            bottom,
            height: window.innerHeight,
            width: window.innerWidth
        })
    }

    mouseIn(e){
        console.log(e.target.getBoundingClientRect());
    }

    mouseDown(e){
        e.target.style.cursor = "grabbing";
        this.setState({
            draggable: true,
        })
    }

    mouseUp(e){
        e.target.style.cursor = "grab";
        this.setState({
            draggable: false
        })
    }

    mouseMove(e){
        if (this.state.draggable){
            console.log(e.nativeEvent);
        }
    }

    render(){
        return(
            <div>
                <div
                ref={this.lens} 
                className="lens"
                onMouseDown={this.mouseDown}
                onMouseMove={this.mouseMove}
                onMouseOver={this.mouseIn}
                onMouseUp={this.mouseUp}
                style={{ 
                    width: "1050px", 
                    height: "700px",

                    }} ></div>
                    <Map
                        className="atlas"
                        ref='map'
                        center={[this.state.lat, this.state.lng]}
                        zoom={this.state.zoom}
                        style={{ width: "1050px", height: "700px"}}
                        zoomControl={false}
                        onDrag={(e) => this.onDrag(e, this.refs)}
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

