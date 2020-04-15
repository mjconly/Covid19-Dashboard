import React, { Component } from "react";
import Charts from "./Charts"

class Dashboard extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="dashboard">
                <Charts></Charts>
            </div>
        );
    }
}

export default Dashboard;