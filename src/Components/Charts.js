import React, { Component, createRef } from "react";
import Chart from "chart.js";
import "../App.scss"
import { findRenderedComponentWithType } from "react-dom/test-utils";


class Charts extends Component{
    constructor(props){
        super(props);

        this.state = {
            display: null,
            cases: null,
            deaths: null,
            message: "",
            visible: "hidden",
            days: 0,
        }

        this.caseChart = createRef();
        this.deathChart = createRef();
    }

    componentDidMount(){
        this.setState({
            message: "Select a country on the map to view cases and deaths over 30 days"
        })
    }

    componentDidUpdate(prevProps){
        if (this.props.data !== prevProps.data){

            let caseChart = this.caseChart.current.getContext("2d");
            let deathChart = this.deathChart.current.getContext("2d");
            
            let cases = this.state.cases;
            let deaths = this.state.deaths;

            if (cases !== null){
                cases.destroy();
            } 

            if (deaths !== null){
                deaths.destroy();
            }

            console.log(this.props.data);
            if (typeof this.props.data === "string"){
                this.setState({
                    message: this.props.data,
                    visible: "hidden"
                })
                return;
            }
            

            const {country, timeline} = this.props.data;
            const message = ``;

            const caseDay = [];
            const caseNum = [];
            const deathDay = [];
            const deathNum = [];
            let firstCase;

            for (let day in timeline.cases){
                if (timeline.cases[day] === 0){
                    continue;
                }
                if (typeof firstCase === "undefined"){
                    firstCase = day;
                }
                caseDay.push(day);
                caseNum.push(timeline.cases[day]);
                deathDay.push(day);
                deathNum.push(timeline.deaths[day]);
            }

            cases = new Chart(caseChart, {
                type:"line",
                data:{
                    labels: caseDay,
                    datasets:[
                        {
                            label:`${country}: Cases Since First Reported Case On ${firstCase}`,
                            borderColor: "#f77b1a",
                            borderWidth: 1,
                            pointRadius: 3,
                            pointHoverRadius: 6,
                            pointHoverBorderWidth: 2,
                            pointHoverBackgroundColor: "white",
                            pointBorderColor: "#f77b1a",
                            data: caseNum,
                        }
                    ]
                },
                options:{
                    responsive: true,
                    title:{
                        display: true,
                        text: `${country}: Cases Since First Reported Case On ${firstCase}`,
                        fontColor: "white",
                        fontSize: 20
                    },
                    legend: {
                        display: false,
                    },
                    scales:{
                        xAxes: [{
                            ticks: {
                                fontColor: "white",
                            },
                            gridLines: {
                                display: false,
                            }
                        }], 
                        yAxes: [{
                            ticks: {
                                fontColor: "white",
                                beginAtZero: true,
                            },
                            gridLines: {
                                display: false,
                            }
                        }]
                    },
                    tooltips:{
                        displayColors: false,
                        backgroundColor: "white",
                        titleFontColor: "hsl(195, 8%, 10%)",
                        titleFontSize: 16,
                        bodyFontColor: "hsl(195, 8%, 10%)",
                        bodyFontSize: 14,
                        xPadding: 10,
                        yPadding: 10,
                        callbacks: {
                            label: (item, data) => {
                                return `Cases: ${item.yLabel}`
                            }
                        }
                    }
                }
            });
            

            deaths = new Chart(deathChart, {
                type: "line",
                data:{
                    labels: deathDay,
                    datasets:[
                        {
                            label: `${country}: Cases Since First Reported Case On ${firstCase}`,
                            borderColor: "#f77b1a",
                            borderWidth: 1,
                            pointRadius: 3,
                            pointHoverRadius: 6,
                            pointHoverBorderWidth: 2,
                            pointHoverBackgroundColor: "white",
                            pointBorderColor: "#f77b1a",
                            data: deathNum,
                        }
                    ]
                },
                options:{
                    responsive: true,
                    title:{
                        display: true,
                        text: `${country}: Deaths Since First Reported Case On ${firstCase}`,
                        fontColor: "white",
                        fontSize: 20
                    },
                    legend: {
                        display: false,
                    },
                    scales:{
                        xAxes: [{
                            ticks: {
                                fontColor: "white",
                            },
                            gridLines: {
                                display: false,
                            }
                        }], 
                        yAxes: [{
                            ticks: {
                                fontColor: "white",
                                beginAtZero: true,
                            },
                            gridLines: {
                                display: false,
                            }
                        }]
                    },
                    tooltips:{
                        displayColors: false,
                        backgroundColor: "white",
                        titleFontColor: "hsl(195, 8%, 10%)",
                        titleFontSize: 16,
                        bodyFontColor: "hsl(195, 8%, 10%)",
                        bodyFontSize: 14,
                        xPadding: 10,
                        yPadding: 10,
                        callbacks: {
                            label: (item, data) => {
                                return `Deaths: ${item.yLabel}`
                            }
                        }
                    }
                }
            });

            this.setState({
                display: this.props.data,
                cases,
                deaths,
                message,
                visible: "visible"
            })

        }
    }

    render(){
        return(
            <div className="dash-charts">
                {this.state.messsage !== ""
                    ?
                    <h2 className="default-text">{this.state.message}</h2>
                    :
                    ""
                }
                <div>
                    <button>Options</button>
                </div>
                <div className="case-container"
                    style={{visibility: `${this.state.visible}`}}
                >
                    <canvas id="caseChart" ref={this.caseChart}></canvas>
                </div>
                <div className="death-container"
                    style={{visibility: `${this.state.visible}`}}
                >
                    <canvas id="deathChar" ref={this.deathChart}></canvas>
                    <br />
                </div>
            </div>
        );
    };
}

export default Charts;