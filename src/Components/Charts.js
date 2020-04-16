import React, { Component, createRef } from "react";
import Chart from "chart.js";
import axios from "axios";
import "../App.scss";



class Charts extends Component{
    constructor(props){
        super(props);

        this.state = {
            display: null,
            cases: null,
            deaths: null,
            provinceCase: null,
            provinceDeath: null,
            message: "",
            visible: "hidden",
            provinceVisible: "hidden",
            days: 0,
            states: [],
            colors: [],
            fetching: false,
            progressVisible: "hidden"
        }

        this.caseChart = createRef();
        this.deathChart = createRef();
        this.provinceCase = createRef();
        this.provinceDeath = createRef();

        this.progressProvinceChart = this.progressProvinceChart.bind(this);
        this.parseStateData = this.parseStateData.bind(this);
        this.buildProvinceChart = this.buildProvinceChart.bind(this);
    }

    componentDidMount(){
        const states = [ "alabama", "alaska","arizona", "arkansas", "california", "colorado", "connecticut", "delaware","florida",
        "georgia","hawaii","idaho","illinois","indiana","iowa","kansas","kentucky","louisiana","maine","maryland","massachusetts","michigan",
        "minnesota","mississippi","missouri","montana","nebraska","nevada","new hampshire","new jersey","new mexico","new york","north carolina",
        "north dakota","ohio", "oklahoma","oregon","pennsylvania", "rhode island","south carolina","south dakota","tennessee","texas",
        "utah","vermont","virginia","washington","west virginia","wisconsin","wyoming"]

        const colors = [
            "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
            "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
            "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
            "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
            "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
            "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
            "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
            "#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
            "#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
            "#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
            "#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
            "#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
            "#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C",
        ]

        this.setState({
            message: "Select a country on the map to view cases and deaths over 30 days",
            states,
            colors,
        })
    }

    async componentDidUpdate(prevProps){
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

            if (typeof this.props.data === "string"){
                this.setState({
                    message: this.props.data,
                    visible: "hidden"
                })
                return;
            }
            

            const {provinces, country, timeline} = this.props.data;
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
                            pointRadius: 2,
                            pointHoverRadius: 5,
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
                            pointRadius: 2,
                            pointHoverRadius: 5,
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

            let progressVisible = "hidden";
            if (provinces.length > 1 || country === "USA"){
                    this.getProvinceData(country, provinces);
                    progressVisible = "visible";

            }

            this.setState({
                display: this.props.data,
                cases,
                deaths,
                message,
                visible: "visible",
                progressVisible,
            })

        }
    }

    progressProvinceChart(curr, total){
        // let provinceCaseChart = this.provinceCase.current.getContext("2d");
        // let provinceDeathChart = this.provinceDeath.current.getContext("2d");
        
        // let provinceCases = this.state.provinceCase;
        // let provinceDeaths = this.state.provinceDeath;

        // if (provinceCases !== null){
        //     provinceCases.destroy();
        // } 

        // if (provinceDeaths !== null){
        //     provinceDeaths.destroy();
        // }

        const progressCase = document.getElementById("animationProgressCase");
        const progressDeath = document.getElementById("animationProgressDeath");
        progressCase.value = curr / total;
        progressDeath.value = curr / total;

        // provinceCases = new Chart(provinceCaseChart, {
        //     options:{
        //         animation: {
        //             onProgress: function(animation){
        //                 progressCase.value = curr / total;
        //             },
        //             onComplete: function() {
		// 				window.setTimeout(function() {
		// 					progressCase.value = 0;
        //                 }, 500);
        //             }
        //         }
        //     }
            
        // })

        // provinceDeaths = new Chart(provinceDeathChart,{
        //     options: {
        //         animation: {
        //             duration: 2000,
        //             onProgress: function(animation){
        //                 progressDeath.value = animation.currentStep / animation.numSteps;
        //             },
        //             onComplete: function() {
		// 				window.setTimeout(function() {
		// 					progressDeath.value = 0;
        //                 }, 2000);
        //             }
        //         }
        //     }
        // })

        if (curr === total){
            progressDeath.value = 1;
            progressCase.value = 1;
            this.setState({
                progressVisible: "hidden",
                provinceDeath: null,
                provinceCase: null,
            })
        }
        
    }

    buildProvinceChart(provinceData, country){
        let provinceCaseChart = this.provinceCase.current.getContext("2d");
        let provinceDeathChart = this.provinceDeath.current.getContext("2d");
        
        let provinceCases = this.state.provinceCase;
        let provinceDeaths = this.state.provinceDeath;

        if (provinceCases !== null){
            provinceCases.destroy();
        } 

        if (provinceDeaths !== null){
            provinceDeaths.destroy();
        }

        const caseSet = [];
        const deathSet = [];
        const barX = [];
        const barY = [];
        const daySet = provinceData[0].day;

        const plotCase = {
            data: [],
            backgroundColor: [],
            borderColor: [],
            label: "Cases"
        }

        const plotDeath = {
            data: [],
            label: "Deaths",
            backgroundColor: [],
            borderColor: [],
        }

        let color = 0;
        let name = country === "USA" ? "state" : "province";

        provinceData.sort((a, b) => {
            if (a[name] < b[name]){
                return -1;
            }
            if (a[name] > b[name]){
                return 1;
            }
            return 0;
        })


        for (let prov of provinceData){
            if (prov[name] === "USA Total"){
                continue;
            }

            barX.push(prov[name]);

            plotCase.data.push(prov.cases);
            plotCase.backgroundColor.push(this.state.colors[color]);
            plotCase.borderColor.push(this.state.colors[color]);

            plotDeath.data.push(prov.deaths);
            plotDeath.backgroundColor.push(this.state.colors[color]);
            plotDeath.borderColor.push(this.state.colors[color]);
            // let plotCase = {
            //     label: `${prov.name} cases`,
            //     fill: false,
            //     borderColor: this.state.colors[color],
            //     // // borderWidth: 1,
            //     // // pointRadius: 2,
            //     // // pointHoverRadius: 3,
            //     // // pointHoverBorderWidth: 2,
            //     // // pointHoverBackgroundColor: "white",
            //     // pointBorderColor: this.state.colors[color],
            //     data: [prov.caseNum[prov.caseNum.length - 1]],
            // }

            // let plotDeath = {
            //     label: `${prov.name} deaths`,
            //     fill: false,
            //     borderColor: this.state.colors[color],
            //     borderWidth: 1,
            //     pointRadius: 2,
            //     pointHoverRadius: 3,
            //     pointHoverBorderWidth: 2,
            //     pointHoverBackgroundColor: "white",
            //     pointBorderColor: this.state.colors[color],
            //     data: prov.deathNum,
            // }
            color ++;
            caseSet.push(plotCase);
            deathSet.push(plotDeath);
        }


        const caseTool = {
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
                    const idx = item.datasetIndex;
                    console.log(item);
                    console.log(data);
                    return `${data.datasets[idx].label}: ${item.yLabel}`
                }
            }
        }

        const deathTool = {
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
                    const idx = item.datasetIndex;
                    return `${data.datasets[idx].label}: ${item.yLabel}`
                }
            }
        }

        const scale = {
            xAxes: [{
                ticks: {
                    fontColor: "white",
                },
                gridLines: {
                    display: false,
                }
            }], 
            yAxes: [{
                type: "logarithmic",
                ticks: {
                    fontColor: "white",
                    beginAtZero: true,
                    callback: function (value, index, values) {
                        if (index % 4 === 0){
                            return value;
                        }
                    }
                },
                gridLines: {
                    display: false,
                }
            }]
        }

        console.log(barY);

        provinceCases = new Chart(provinceCaseChart, {
            type: "bar",
            data:{
                labels: barX,
                datasets: [plotCase],
            },
            options:{
                responsive: true,
                title:{
                    display: true,
                    text: `${country}: Cases by Province`,
                    fontColor: "white",
                    fontSize: 20,
                },
                legend: {
                    display: false,
                },
                scales: scale,
                tooltips: caseTool,
            }           
        })

        provinceDeaths = new Chart(provinceDeathChart,{
            type: "bar",
            data:{
                labels: barX,
                datasets: [plotDeath],
            },
            options:{
                responsive: true,
                title:{
                    display: true,
                    text: `${country}: Deaths by Province`,
                    fontColor: "white",
                    fontSize: 20,
                },
                legend: {
                    display: false,
                },
                scales: scale,
                tooltips: deathTool,
            }
        })

        
        this.setState({
            provinceCase: provinceCases,
            provinceDeath: provinceDeaths,
            progressVisible: "hidden",
            provinceVisible: "visible",
        })
    }

    async getProvinceData(country, provinces){
        const response = [];
        if (country === "USA"){
            provinces = this.state.states;
            let curr = 0;
            const total = provinces.length - 1;
            this.progressProvinceChart(curr, total);
            axios.get("https://corona.lmao.ninja/v2/states")
                .then((res) => {
                    this.buildProvinceChart(res.data, country)
                })
                .catch((err) => {console.log(err)});
            }

            // for (let prov of provinces){
            //     let url = `https://corona.lmao.ninja/v2/historical/usacounties/${prov}?lastdays=all`;
            //     await axios.get(url)
            //         .then((res) => {
            //             response.push(res.data)
            //             this.progressProvinceChart(curr, total);
            //         })
            //         .catch((err) => console.log(err));
            //         curr++
            // }

            // const stateData = this.parseStateData(response);
            // this.buildProvinceChart(stateData, country);
    }

    parseStateData(data){
        const allState = [];
        
        for (let st of data){
            let state = {};
            state.name = st[0].province;
            state.cases = st[0].timeline.cases;
            state.deaths = st[0].timeline.deaths;
            state.day = [];
            state.caseNum = [];
            state.deathNum = [];
            for (let ct = 1; ct < st.length; ct++){
                let county = st[ct];
                let timelineCase = county.timeline.cases;
                let timelineDeath = county.timeline.deaths;
                for(let day in timelineCase){
                    state.cases[day] += timelineCase[day];
                    state.deaths[day] += timelineDeath[day]; 
                }
            }

            for (let days in state.cases){
                state.day.push(days);
                state.caseNum.push(state.cases[days]);
                state.deathNum.push(state.deaths[days]);
            }

            allState.push(state);
        }

        return allState;
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
                <div className="case-container"
                    style={{visibility: `${this.state.visible}`}}
                >
                    <canvas id="caseChart" ref={this.caseChart}></canvas>
                </div>
                <div className="death-container"
                    style={{visibility: `${this.state.visible}`}}
                >
                    <canvas id="deathChar" ref={this.deathChart}></canvas>
                </div>
                <div className="prov-case-container"
                    style={{visibility: `${this.state.provinceVisible}`}}
                >
                    <canvas id="deathChar" ref={this.provinceCase}></canvas>
                    <progress id="animationProgressCase" max="1" value="0" 
                    style={{ 
                        width: "100%",
                        visibility: `${this.state.progressVisible}`,
                        }}>
                    </progress>
                </div>
                <div className="prov-death-container"
                    style={{visibility: `${this.state.provinceVisible}`}}
                >
                    <canvas id="deathChar" ref={this.provinceDeath}></canvas>
                    <progress id="animationProgressDeath" max="1" value="0" 
                    style={{
                        width: "100%",
                        visibility: `${this.state.progressVisible}`
                    }}
                    ></progress>
                </div>
            </div>
        );
    };
}

export default Charts;