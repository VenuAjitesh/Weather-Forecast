google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    const res = JSON.parse(localStorage.getItem('sevenDayForecast'))

    const arrData = [
        ['Date', 'Min temp.', 'Max temp.']
    ]

    for(i=1;i<res.length;++i){
        const dateObj = new Date(res[i].dt * 1000)
        const orgDate = dateObj.toLocaleString("en-US", {dateStyle: "short" })
        const maxTemp = res[i].temp.max;
        const minTemp = res[i].temp.min;
        arrData.push([orgDate, minTemp, maxTemp])
    }

    var data = google.visualization.arrayToDataTable(arrData);

    var options = {
        title: 'Seven days weather info. (in Celsious)',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chartToDraw = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chartToDraw.draw(data, options);
}

var modal = document.getElementById('myModal')
var modal2 = document.getElementById('myModal2')

var btn = document.getElementById("myBtn");
var btn2 = document.getElementById("myBtnB");

var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];

btn.onclick = function() {
  modal.style.display = "block";
}

btn2.onclick = function() {
  modal2.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

span2.onclick = function() {
  modal2.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal || event.target == modal2) {
    modal.style.display = "none";
    modal2.style.display = "none";
  }
}