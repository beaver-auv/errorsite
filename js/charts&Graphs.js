const motorGraph = document.getElementById("motorGraph");
const chartPID = document.getElementById("chartPID");
let timestamp = 0;
let AUVactive = true;
// Pull from same place as desiredPID (just for setup)
let initialDesired = 20;
let lastDesired = 20;

let PID = new Chart(chartPID, {
  type: "line",
  data: {
    labels: ["0"], //["-3", "-2.5", "-2", "-1.5", "-1", "-0.5", "0"], // Limited display data
    datasets: [{
      label: "PID Level",
      data: [0],
      borderWidth: 1,
      tension: 0.4,
      backgroundColor: "#36A2EB",
      borderColor: "#36A2EB"
    },
    {
      label: "Desired PID",
      data: [initialDesired],
      borderColor: "black",
      borderWidth: 1,
      borderDash: [10, 5],
      pointRadius: 0
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
          color: "rgba(0, 0, 0, 0.1)"
        }
      }
    }
  }
});


setInterval(function() {
  //Fetch the current PID level from other data later
  let currentPID = 0;
  PID.data.datasets[0].data.push(currentPID); 

  timestamp -= 0.5;
  PID.data.labels.unshift(String(timestamp));

  PID.update();

  //Fetch the sub's desired PID from other data later
  let desiredPID = 20;
  PID.data.datasets[1].data.push(desiredPID);

  if (timestamp == 0.5) {
    PID.data.datasets[1].data.shift();
    PID.data.datasets[1].data.push(desiredPID);
  } else if (desiredPID != lastDesired) {
    for (let i = 0; i <= PID.data.datasets[1].data.length; i++) {
      PID.data.datasets[1].data[i] = desiredPID;
    };
  };

  lastDesired = desiredPID;

  PID.update("none");
}, 500); // Executed every 500 miliseconds