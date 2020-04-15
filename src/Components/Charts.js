import React, { Component, createRef } from "react";
import Chart from "chart.js";


class Charts extends Component{
    constructor(props){
        super(props);

        this.chart = createRef();
    }

    componentDidMount(){
        const theChart = this.chart.current.getContext("2d");

        new Chart(theChart, {
            type:"line",
            data:{
                labels:["Jan", "Feb", "March", "April"],
                datasets:[
                    {
                        label:"Sales",
                        data:[86,67,91, 100],
                    }
                ]
            },
            options:{

            }
        });
    }

    render(){
        return(
            <div className="chart-container">
                <canvas id="chart" ref={this.chart}></canvas>
            </div>
        );
    };
}

export default Charts;