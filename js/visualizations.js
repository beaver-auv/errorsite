const motorGraph = document.getElementById("motorGraph");
const chartPID = document.getElementById("chartPID");
const motorCount = document.getElementById("aM")
let timestamp = 0;
let repetitions = 1;

// Pull from same place as desiredPID (just for setup)
let initialDesired = 20;
let lastDesired = 20;

// Pull from same place as current PID (just for setup)
let initialPID = 0;

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
    for (let i = 0; i <= repetitions; i++) {
      PID.data.datasets[1].data[i] = desiredPID;
    };
  };

  lastDesired = desiredPID;
  repetitions += 1;

  PID.update("none");
}, 500); // Executed every 500 miliseconds

document.addEventListener("DOMContentLoaded", function() {
  const svg = d3.select("#motorVisualization");

  // Fetch the number of motors from the rest of the code later
  let numMotors = 6

  let motors = []

  // Example motor data. Fetch the actual data from the rest of code later
  if (numMotors == 8) {
    motorCount.textContent = "Active Motors: 8"
    motors = [
      { id: 1, x: 100, y: 100, acceleration: { x: 30, y: -20 }, rotation: 45 },
      { id: 2, x: 300, y: 100, acceleration: { x: -25, y: 15 }, rotation: -30 },
      { id: 3, x: 100, y: 300, acceleration: { x: 10, y: 25 }, rotation: 90 },
      { id: 4, x: 300, y: 300, acceleration: { x: 0, y: 0 }, rotation: 0 },
      { id: 5, x: 140, y: 140, acceleration: { x: 20, y: -5 }, rotation: 60 },
      { id: 6, x: 260, y: 140, acceleration: { x: 15, y: 0 }, rotation: 10 },
      { id: 7, x: 140, y: 260, acceleration: { x: 0, y: 25 }, rotation: -70 },
      { id: 8, x: 260, y: 260, acceleration: { x: 0, y: 0 }, rotation: 50 }
    ];
  } else if (numMotors == 6) {
    motorCount.textContent = "Active Motors: 6"
    motors = [
      { id: 1, x: 100, y: 100, acceleration: { x: 30, y: -20 }, rotation: 45 },
      { id: 2, x: 300, y: 100, acceleration: { x: -25, y: 15 }, rotation: -30 },
      { id: 3, x: 100, y: 300, acceleration: { x: 10, y: 25 }, rotation: 90 },
      { id: 4, x: 300, y: 300, acceleration: { x: 0, y: 0 }, rotation: 0 },
      { id: 5, x: 200, y: 125, acceleration: { x: 20, y: -5 }, rotation: 60 },
      { id: 6, x: 200, y: 275, acceleration: { x: 15, y: 0 }, rotation: 10 }
    ];
  } else if (numMotors == 4) {
    motorCount.textContent = "Active Motors: 4"
    motors = [
      { id: 1, x: 100, y: 100, acceleration: { x: 30, y: -20 }, rotation: 45 },
      { id: 2, x: 300, y: 100, acceleration: { x: -25, y: 15 }, rotation: -30 },
      { id: 3, x: 100, y: 300, acceleration: { x: 10, y: 25 }, rotation: 90 },
      { id: 4, x: 300, y: 300, acceleration: { x: 0, y: 0 }, rotation: 0 }
    ];
  } else {
    motorCount.textContent = "Active Motors: Error"
    motors = [
      { id: 1, x: 200, y: 200, acceleration: { x: 0, y: 0 }, rotation: 0 }
    ];
  };

  // Define an arrow marker to draw acceleration vectors.
  const defs = svg.append("defs");
  defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#000");

  // Create a group for each motor.
  const motorGroup = svg.selectAll("g.motor")
                        .data(motors)
                        .enter()
                        .append("g")
                        .attr("class", "motor")
                        .attr("transform", d => `translate(${d.x}, ${d.y})`);

  // Draw a square for each motor (rotated by the motor's rotation).
  const squareSize = 30;
  motorGroup.append("rect")
            .attr("x", -squareSize / 2)
            .attr("y", -squareSize / 2)
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("fill", "#ccc")
            .attr("stroke", "#000")
            .attr("transform", d => `rotate(${d.rotation})`);

  // Draw an arrow representing the acceleration vector.
  motorGroup.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", d => d.acceleration.x)
            .attr("y2", d => d.acceleration.y)
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

  // Add a text label with the motor ID below each square.
  motorGroup.append("text")
            .attr("x", 0)
            .attr("y", squareSize / 2 + 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "#333")
            .text(d => `Motor ${d.id}`);
});
