import React, { Component, createRef } from "react";
import { Map, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L, { divIcon, icon } from "leaflet"
import axios from "axios";
import { renderToStaticMarkup } from "react-dom/server";
import Dashboard from "./Dashboard";
import "../App.scss";


class Atlas extends Component{
    constructor(props){
        super(props);

        this.state={
            lat: 30,
            lng: 0,
            zoom: 2,
            markers: null,
            selected: "",
        }

        this.getData = this.getData.bind(this);
        this.onCountrySelect = this.onCountrySelect.bind(this);
    }

    componentDidMount(){
        this.getData()
    }

    componentWillUnmount(){
       
    }

    async onCountrySelect(country){
        const start = new Date("1/1/2020");
        const end = new Date(Date.now());

        const difference = end.getTime() - start.getTime();

        const days = difference / (1000 * 3600 * 24);

        axios.get(`https://corona.lmao.ninja/v2/historical/${country}?lastdays=${days}`)
            .then((res) => {
                this.setState({
                    selected: res.data
                })
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    selected: `Data for past 60 days not avaliable for ${country}` 
                })
            })
    }

    async getData(){

        await axios.get("https://corona.lmao.ninja/v2/countries")
            .then((res) => {
                const geoJson = {
                    type: "FeatureCollection",
                    features: res.data.map((country) => {
                        const caseString = `${country.cases}`;
                        const caseMarker = country.cases > 1000 ? caseString.slice(0, -3) + "K+" : caseString;
                        const iconMarkup = renderToStaticMarkup( 
                            <div
                            key={country} 
                            className="icon-marker"
                            >{caseMarker}
                            </div>
                        )

                        return {
                            type: "Feature",
                            properties: {
                                ...country
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [country.countryInfo.lat, country.countryInfo.long]
                            },
                            icon: divIcon({
                                html: iconMarkup
                            }),
                        }
                    })
                }

                const markers = geoJson.features.map((marker) => {
                    const coords = marker.geometry.coordinates;

                    return (
                        <Marker 
                        key={marker.properties.country} 
                        position={coords} 
                        icon={marker.icon}
                        onClick={() => this.onCountrySelect(marker.properties.country)}
                        >
                            <Popup>
                                <li><h3>{marker.properties.country}</h3></li>
                                <li className="update-on">Last Update: {new Date(marker.properties.updated).toLocaleString()}</li>
                                <div key={marker.properties.country} className="popup-content">
                                    <br />
                                        <div className="popup-list">
                                            <li> <span className="cases stub">Cases: </span>{marker.properties.cases}</li>
                                            <li> <span className="cases stub">New Cases: </span>{marker.properties.todayCases}</li>
                                            <li> <span className="deaths stub">Deaths: </span>{marker.properties.deaths}</li>
                                            <li> <span className="deaths stub">New Deaths: </span>{marker.properties.todayDeaths}</li>
                                            <li> <span className="recovered stub">Recovered: </span>{marker.properties.recovered}</li>
                                            <li> <span className="active stub">Active: </span>{marker.properties.active}</li>
                                            <li> <span className="critical stub">Critical: </span>{marker.properties.critical}</li>
                                        </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })

                this.setState({
                    markers
                })
            })
            .catch((err) => {console.log(err)})
    }

    render(){
        return(
            <div className="main-container">
                <div className="map-container">
                    <Map
                        className="atlas"
                        center={[this.state.lat, this.state.lng]}
                        zoom={this.state.zoom}
                        minZoom={2}
                        maxBoundsViscosity={.5}
                        maxBounds={[[-200, 200], [200, -200]]}
                        style={{ 
                            width: "50vw", 
                            height: "100vh",
                        }}
                    >
                        <TileLayer
                            attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
                            url="https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNvbiIsImEiOiJjazhxd3dqMTgwOG91M2RwZHN3MHlvYnVsIn0.DKv7sGBKWa6QdsFVZzNyNg"
                    />
                        {this.state.markers}
                    </Map>
                </div>
                <Dashboard selected={this.state.selected}></Dashboard>
            </div>
        )
    }
}

export default Atlas;

