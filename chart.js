module.exports = () => { 
    return new Promise((resolve, reject) => {
        const { Chart } = require("chart.js");

        Chart.plugins.register({
            beforeDraw: function (chartInstance) {
                var ctx = chartInstance.chart.ctx;
                ctx.fillStyle = "#222222";
                ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
            }
        });

        Chart.pluginService.register({
            beforeRender: function (chart) {
            if (chart.config.options.showAllTooltips) {
                    // create an array of tooltips
                    // we can't use the chart tooltip because there is only one tooltip per chart
                    chart.pluginTooltips = [];
                    chart.config.data.datasets.forEach(function (dataset, i) {
                        chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                            chart.pluginTooltips.push(new Chart.Tooltip({
                            _chart: chart.chart,
                            _chartInstance: chart,
                            _data: chart.data,
                            _options: chart.options.tooltips,
                            _active: [sector]
                            }, chart));
                        });
                    });
            
                    // turn off normal tooltips
                    chart.options.tooltips.enabled = false;
                }
            },
            afterDraw: function (chart, easing) {
                if (chart.config.options.showAllTooltips) {
                    // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                    if (!chart.allTooltipsOnce) {
                        if (easing !== 1) return;
                        chart.allTooltipsOnce = true;
                    }
                
                    // turn on tooltips
                    chart.options.tooltips.enabled = true;
                    Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                        tooltip.initialize();
                        tooltip.update();
                        // we don't actually need this since we are not animating tooltips
                        tooltip.pivot();
                        tooltip.transition(easing).draw();
                    });
                    chart.options.tooltips.enabled = false;
                }
            }
        });

        // Database
        const { connection } = require("./index.js")
        connection.query("SELECT * FROM `Member Count`", (error, results, fields) => {
            results.sort((a, b) => a.Date - b.Date)
            const values = results.map(r => parseInt(r.Count))
            const dates = results.map(r => {
                const date = new Date(r.Date)
                return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            })
            const fs = require("fs");
            const { Canvas } = require("canvas");
            const { JSDOM } = require("jsdom");
            //JSDOM
            let width = 720;
            let height = 720;
            const dom = new JSDOM(`
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <div id="chart-div" style="font-size:12; width:${width}; height: ${height};">
                        <canvas id="memberCountChart" width=${width} height=${height} style="background-color: red;"></canvas>
                    </div>
                </body>
            </html>
            `);
            global.window = dom.window;
            global.document = dom.window.document;
            global.Image = window.Image;
            global.Node = window.Node;
            let canvas = document.getElementsByTagName("canvas")[0];
            let ctx = canvas.getContext('2d');
            const nOfValues = values.length
            let nOfTooltips = 0
            //CHART
            const chart = new Chart(ctx, {
                type: 'line',
                showAllTooltips: true,
                data: {
                    labels: dates,
                    datasets: [{
                        pointRadius: 0,
                        label: "Member Count",
                        backgroundColor: "white",
                        borderColor: "white",
                        data: values,
                        fill: false,
                        lineTension: 0.5
                    }]
          
                },
                options: {
                    showAllTooltips: true,
                    animation: {
                        onComplete: chartDone,
                        duration: 0
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        filter (item, data) {
                            nOfTooltips++
                            return nOfTooltips === nOfValues
                        }
                    },
                    responsive: false,
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: "Date (dd-mm-yyyy)"
                            },
                            gridLines: {
                                color: "#474747"
                            },
                            ticks: {
                                fontColor: "white"
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: "Member Count"
                            },
                            ticks: {
                                beginAtZero: false,
                                stepSize: 1,
                                fontColor: "white"
                            },
                            gridLines: {
                                color: "#474747"
                            }
                        }]
                    }
                }
            })

            function chartDone() {
                let dataURL = canvas.toDataURL('image/png');
                dataURL = dataURL.replace(/data:image\/png;base64,/i, '');
                var bitmap = new Buffer.from(dataURL, 'base64');
                fs.writeFileSync(`${__dirname}/memberCountGraph.png`, bitmap, err => {
                    if (err) reject("bruh");
                });
                resolve()
            }



            //updateGraph();
            //setInterval(updateGraph, 3600000);
        })
    })
}