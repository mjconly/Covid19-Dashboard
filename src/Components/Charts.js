import React, { Component, createRef } from "react";
import Chart from "chart.js";


class Charts extends Component{
    constructor(props){
        super(props);

        this.caseChart = createRef();
        this.deathChart = createRef();
    }

    componentDidMount(){
        const caseChart = this.caseChart.current.getContext("2d");
        const deathChart = this.deathChart.current.getContext("2d");

        new Chart(caseChart, {
            type:"line",
            data:{
                labels: ["Jan", "Feb", "March", "April"],
                datasets:[
                    {
                        label:"Cases",
                        data:[86,67,91,100],
                    }
                ]
            },
            options:{

            }
        });

        new Chart(deathChart, {
            type: "line",
            data:{
                labels: ["Jan", "Feb", "March", "April"],
                datasets:[
                    {
                        label: "Deaths",
                        data: [20, 25, 20, 25],
                    }
                ]
            },
            options:{

            }
        });
    }

    render(){
        return(
            <div className="dash-charts">
                <div className="case-container">
                    <canvas id="caseChart" ref={this.caseChart}></canvas>
                </div>
                <div className="death-container">
                    <canvas id="deathChar" ref={this.deathChart}></canvas>
                </div>
            </div>   
        );
    };
}

export default Charts;