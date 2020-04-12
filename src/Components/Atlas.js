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
            mouseX: 0,
            mouseY: 0,
            transX: 0,
            transY: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            draggable: false
        }

        this.lens = createRef();

        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.windowSize = this.windowSize.bind(this);
    }

    componentDidMount(){
        window.addEventListener("resize", this.windowSize);
        this.refs.map.leafletElement._layersMinZoom = 2;
        console.log(this.refs.map.leafletElement.options);
        this.windowSize();
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.windowSize);
    }

    windowSize(){
        const {left, top, right, height} = this.lens.current.parentElement.getBoundingClientRect();

        const zoomControl = document.getElementsByClassName("leaflet-control-zoom");
        zoomControl[0].style.opacity = "0.5";
        console.log(zoomControl)

        this.setState({
            top: top + 1,
            left: left + 1,
            right: right,
            bottom: height,
            height: window.innerHeight,
            width: window.innerWidth,
            transX: 0,
            transY: 0
        })
    }

    mouseDown(e){
        e.target.style.cursor = "grabbing";

        console.log(this.lens);

        const {clientX, clientY} = e.nativeEvent;

        this.setState({
            draggable: true,
            mouseX: clientX,
            mouseY: clientY
        })
    }

    mouseUp(e){
        e.target.style.cursor = "grab";
        this.setState({
            draggable: false,
        })
    }

    mouseMove(e){
        if (this.state.draggable){
            let x = e.nativeEvent.clientX;
            let y = e.nativeEvent.clientY;

            let currX = this.state.transX;
            let currY = this.state.transY;

            let dx = x - this.state.mouseX;
            let dy = y - this.state.mouseY;

            dx += currX;
            dy += currY; 

            const {left, right, top, height} = this.lens.current.getBoundingClientRect();

            
            let toLeft = left + dx;
            let toRight = right + dx;
            let toTop = top + dy;
            let toBot = height + dy;

            let leftB = this.state.left + 10;
            let rightB = this.state.right - 10;
            let topB = this.state.top + 10;
            let botB = this.state.bottom - 10;
            

            if (toLeft <= leftB && toRight >= rightB && toTop <= topB && toBot >= botB){
                this.setState({
                    transX: dx,
                    transY: dy
                })
             }
        }
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

