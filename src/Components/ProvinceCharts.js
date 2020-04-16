import React, { Component, createRef } from "react";
import Chart from "chart.js";
import axios from "axios";
import "../App.scss";


class ProvinceChart extends Component{
    constructor(props){
        super(props);

        this.state = {
            provinceCase: null,
            provinceDeath: null,
            message: "",
            provinceVisible: "hidden",
            states: [],
            colors: [],
            progressVisible: "hidden"
        }

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
            states,
            colors,
        })
    }

    async componentDidUpdate(prevProps){
        console.log("outside");
        if (this.props.selected !== prevProps.selected){
            console.log("inside")
            let progressVisible = "hidden";
            let provinces = [1,3];
            if (provinces.length > 1 || this.props.selected.country === "USA"){
                    this.getProvinceData(this.props.selected.country, this.state.states);
                    progressVisible = "visible";

            }

            this.setState({
                progressVisible,
            })
        }
    }

    progressProvinceChart(curr, total){
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

        const progressCase = document.getElementById("animationProgressCase");
        const progressDeath = document.getElementById("animationProgressDeath");

        provinceCases = new Chart(provinceCaseChart, {
            options:{
                animation: {
                    onProgress: function(animation){
                        progressCase.value = curr / total;
                    }
                }
            }
            
        })

        provinceDeaths = new Chart(provinceDeathChart,{
            options: {
                animation: {
                    onProgress: function(animation){
                        progressDeath.value = curr / total;
                    }
                }
            }
        })

        if (curr === total){
            this.setState({
                progressVisible: "hidden",
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
        const daySet = provinceData[0].day;

        let color = 0;
        for (let prov of provinceData){
            let plotCase = {
                label: `${prov.name} cases`,
                borderColor: this.state.colors[color],
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 3,
                pointHoverBorderWidth: 2,
                pointHoverBackgroundColor: "white",
                pointBorderColor: this.state.colors[color],
                data: prov.caseNum,
            }

            let plotDeath = {
                label: `${prov.name} deaths`,
                borderColor: this.state.colors[color],
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 3,
                pointHoverBorderWidth: 2,
                pointHoverBackgroundColor: "white",
                pointBorderColor: this.state.colors[color],
                data: prov.deathNum,
            }
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
                ticks: {
                    fontColor: "white",
                    beginAtZero: true,
                },
                gridLines: {
                    display: false,
                }
            }]
        }

        provinceCases = new Chart(provinceCaseChart, {
            type: "line",
            data:{
                labels: daySet,
                datasets: caseSet,
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
            type: "line",
            data:{
                labels: daySet,
                datasets: deathSet,
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
            provinceVisible: "visible",
        })

    }

    async getProvinceData(country, provinces){
        console.log(country);
        const response = [];
        if (country === "USA"){
            provinces = this.state.states;
            let curr = 0;
            const total = provinces.length - 1;
            for (let prov of provinces){
                let url = `https://corona.lmao.ninja/v2/historical/usacounties/${prov}?lastdays=60`;
                await axios.get(url)
                    .then((res) => {
                        response.push(res.data)
                        this.progressProvinceChart(curr, total);
                    })
                    .catch((err) => console.log(err));
                    curr++
            }

            const stateData = this.parseStateData(response);
            this.buildProvinceChart(stateData, country);

        }
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
                <div className="prov-case-container"
                    style={{visibility: `${this.state.provinceVisible}`}}
                >
                    <canvas id="deathChar" ref={this.provinceCase}></canvas>
                    <progress id="animationProgressCase" max="1" value="0" 
                    style={{ 
                        width: "100%",
                        visibility: `${this.state.progressVisible}`
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

export default ProvinceChart;