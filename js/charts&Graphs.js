const motorGraph = document.getElementById("motorGraph");
const chartPID = document.getElementById("chartPID")
var AUVactive = true

PID = new Chart(chartPID, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
      label: "PID Level",
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
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
          color: 'rgb(217, 24, 24)'
        }
      }
    }
  }
});

/*while (AUVactive){
  PID.data = [12, 19, 3, 5, 2, 3]

  PID.update()
}*/