google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  const data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Score',     75],
    ['Remaining',      25]
  ]);

  const options = {
    title: 'Your Voter Readiness Index',
    pieHole: 0.8,
    colors: ['green', 'red'],
    chartArea: {width: "400", height: "400", left: '50'},
    legend: 'none',
    pieStartAngle: 114
  };

  const donutchart = document.getElementById('donutchart');

  if (donutchart) {
    const chart = new google.visualization.PieChart(donutchart);
    chart.draw(data, options);
  }
}
