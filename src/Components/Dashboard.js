import React, { Component } from "react";
import Charts from "./Charts"
import "../App.scss"

class Dashboard extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="dashboard">
                <Charts data={this.props.selected}></Charts>
            </div>
        );
    }
}

export default Dashboard;