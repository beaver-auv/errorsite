const motorGraph = document.getElementById("motorGraph");
const chartPID = document.getElementById("chartPID")
let timestamp = 0
let AUVactive = true

let PID = new Chart(chartPID, {
  type: "line",
  data: {
    labels: ["0"], //["-3", "-2.5", "-2", "-1.5", "-1", "-0.5", "0"], // Limited display data
    datasets: [{
      label: "PID Level",
      data: [0],
      borderWidth: 1,
      tension: 0.4
    }]
  },
  options: {
    scales: {
      y: {
        min: -100,
        max: 100,
        title: {
          display: true,
          text: "Desired PID"
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }
});


setInterval(function() {
  //Fetch currentPID from other data
  let currentPID = 0
  PID.data.datasets[0].data.push(currentPID);

  timestamp -= 0.5
  PID.data.labels.unshift(String(timestamp))

  PID.update()
}, 500); // Executed every 500 miliseconds