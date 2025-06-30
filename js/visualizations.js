/* Handles the motor and PID charts */
const chartPID = document.getElementById("chartPID");
const motorCount = document.getElementById("aM");
const testButton = document.getElementById("testingButton");
const motorData1 = document.getElementById("motorData1");
const motorData2 = document.getElementById("motorData2");
let setupTagPID = true;
let timestamp = 0;
let repetitions = 1;
let isPausedMotor = false;

// Pull from same place as desiredPID (just for setup)
let initialDesired = 20;
let lastDesired = 20;

// Pull from same place as current PID (just for setup)
let initialPID = 0;
let lastPID = 0;

let pidStorage = {
  labels: ["0"],
  actual: [initialPID],
  desired: [initialDesired]
};

let motorStorage = {
  motorOne: [],
  motorTwo: [],
  motorThree: [],
  motorFour: [],
  motorFive: [],
  motorSix: [],
  motorSeven: [],
  motorEight: []
};

/* PID Chart Setup */
let PID = new Chart(chartPID, {
  type: "line",
  data: {
    labels: [], //["-3", "-2.5", "-2", "-1.5", "-1", "-0.5", "0"], // Limited display data ver
    datasets: [{
      label: "PID Level",
      data: [],
      borderWidth: 1,
      tension: 0.4,
      backgroundColor: "#36A2EB",
      borderColor: "#36A2EB"
    },
    {
      label: "Desired PID",
      data: [],
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

/* PID Chart Loop */
function startChartPID() {
  if (typeof loopPID !== "undefined") {
    clearInterval(loopPID);
  };

  timestamp = 0;
  repetitions = 1;

  loopPID = setInterval(function() {
    // Fetch the current PID level from other data later
    let currentPID = 0;
    PID.data.datasets[0].data.push(currentPID); 
    pidStorage.actual.push(currentPID);


    PID.data.labels.unshift(String(timestamp));
    pidStorage.labels.unshift(String(timestamp));

    timestamp -= 0.5;


    PID.update();

    // Fetch the sub's desired PID from other data later
    let desiredPID = 20;
    PID.data.datasets[1].data.push(desiredPID);
    pidStorage.desired.push(desiredPID);

    if (timestamp == -0.5) {
      PID.data.datasets[1].data.shift();
      PID.data.datasets[1].data.push(desiredPID);

      pidStorage.desired.shift();
      pidStorage.desired.push(desiredPID);
    } else if (desiredPID != lastDesired) {
      for (let i = 0; i <= repetitions; i++) {
        PID.data.datasets[1].data[i] = desiredPID;
        pidStorage.desired[i] = desiredPID
      };
    };

    lastDesired = desiredPID;
    lastPID = currentPID;
    repetitions += 1;

    PID.update("none");
  }, 500); // Executed every 500 miliseconds
};

/* Motor Visualization Loop */
function startChartM() {
  loopMotor = setInterval(function() {
    if (isPausedMotor) {
      // To be added to
      isPausedMotor = false;
    };
    const svg = d3.select("#motorVisualization");

    // Fetch the number of motors from the rest of the code later
    let numMotors = 8;

    let motors = [];

    // Fetch acceleration values from rest of code later
    if (numMotors == 8) {
      accelList = {
        horiMotors: [-100, -100, 100, 100],
        vertMotors: [-100, 100, 100, -100]
      };
    } else if (numMotors == 6) {
      accelList = {
        horiMotors: [-100, -100, 100, 100],
        vertMotors: [-100, 100]
      };
    };

    // Convert accleration values into acceptable data to make into arrows
    function calculateVectH(speed, angle, dir) {
      // Scale speed to pixel range
      const magnitude = (speed / 100) * 40;

      const angle45 = Math.SQRT1_2;

      if (angle === "+") {
        if (dir === "n") {
          return {
            x: magnitude * angle45,
            y: -magnitude * angle45
          };
          
        } else if (dir === "s") {
          return {
            x: magnitude * -angle45,
            y: -magnitude * -angle45
          };
        } else {
          errorHandler("Error creating motor display")
        };

      } else if (angle === "-") {
        if (dir === "n") {
          return {
            x: magnitude * -angle45,
            y: -magnitude * angle45
          };
          
        } else if (dir === "s") {
          return {
            x: magnitude * angle45,
            y: -magnitude * -angle45
          };
        } else {
          errorHandler("Error creating motor display")
        };

      } else {
        errorHandler("Error creating motor display")
      };
    };

    function calculateVectV(speed) {
      return {
        x: 0,
        y: -(speed / 100) * 40
      };
    }


    // Presets for the motor layouts based on motor count
    if (numMotors == 8) {
      motorCount.textContent = "Active Motors: 8";
      motors = [
        { id: 1, x: 100, y: 100, acceleration: calculateVectH(accelList.horiMotors[0], "-", "n"), rotation: 45 },
        { id: 2, x: 300, y: 100, acceleration: calculateVectH(accelList.horiMotors[1], "+", "n"), rotation: 45 },
        { id: 3, x: 100, y: 300, acceleration: calculateVectH(accelList.horiMotors[2], "+", "s"), rotation: 45 },
        { id: 4, x: 300, y: 300, acceleration: calculateVectH(accelList.horiMotors[3], "-", "s"), rotation: 45 },
        { id: 5, x: 140, y: 140, acceleration: calculateVectV(accelList.vertMotors[0]), rotation: 0 },
        { id: 6, x: 260, y: 140, acceleration: calculateVectV(accelList.vertMotors[1]), rotation: 0 },
        { id: 7, x: 140, y: 260, acceleration: calculateVectV(accelList.vertMotors[2]), rotation: 0 },
        { id: 8, x: 260, y: 260, acceleration: calculateVectV(accelList.vertMotors[3]), rotation: 0 }
      ];

      motorData1.innerHTML = `
      <h3 class="topspace2">Motor 1</h3>
      <h5 class="downspace2">Acceleration: ${accelList.horiMotors[0]}%</h5>

      <h3>Motor 2</h3>
      <h5 class="downspace2">Acceleration: ${accelList.horiMotors[1]}%</h5>

      <h3>Motor 3</h3>
      <h5 class="downspace2">Acceleration: ${accelList.horiMotors[2]}%</h5>

      <h3>Motor 4</h3>
      <h5 class="downspace2">Acceleration: ${accelList.horiMotors[3]}%</h5>`

      motorData2.innerHTML = `
      <h3 class="topspace2">Motor 5</h3>
      <h5 class="downspace2">Acceleration: ${accelList.vertMotors[0]}%</h5>

      <h3>Motor 6</h3>
      <h5 class="downspace2">Acceleration: ${accelList.vertMotors[1]}%</h5>

      <h3>Motor 7</h3>
      <h5 class="downspace2">Acceleration: ${accelList.vertMotors[2]}%</h5>

      <h3>Motor 8</h3>
      <h5 class="downspace2">Acceleration: ${accelList.vertMotors[3]}%</h5>`
    } else if (numMotors == 6) {
      motorCount.textContent = "Active Motors: 6";
      motors = [
        { id: 1, x: 100, y: 100, acceleration: calculateVectH(accelList.horiMotors[0], "-", "n"), rotation: 45 },
        { id: 2, x: 300, y: 100, acceleration: calculateVectH(accelList.horiMotors[1], "+", "n"), rotation: 45 },
        { id: 3, x: 100, y: 300, acceleration: calculateVectH(accelList.horiMotors[2], "+", "s"), rotation: 45 },
        { id: 4, x: 300, y: 300, acceleration: calculateVectH(accelList.horiMotors[3], "-", "s"), rotation: 45 },
        { id: 5, x: 200, y: 125, acceleration: calculateVectV(accelList.vertMotors[0]), rotation: 0 },
        { id: 6, x: 200, y: 275, acceleration: calculateVectV(accelList.vertMotors[1]), rotation: 0 }
      ];

      motorData1.innerHTML = `
      <h3 class="topspace2">Motor 1</h3>
      <h5 class="downspace2">Acceleration: ${accelList.horiMotors[0]}%</h5>

      <h3>Motor 2</h3>
      <h5 class="downspace2">Acceleration: ${accelList.horiMotors[1]}%</h5>

      <h3>Motor 3</h3>
      <h5 class="downspace2">Acceleration: ${accelList.horiMotors[2]}%</h5>`

      motorData2.innerHTML = `
      <h3 class="topspace2">Motor 4</h3>
      <h5 class="downspace2">Acceleration: ${accelList.horiMotors[3]}%</h5>

      <h3>Motor 5</h3>
      <h5 class="downspace2">Acceleration: ${accelList.vertMotors[0]}%</h5>

      <h3>Motor 6</h3>
      <h5 class="downspace2">Acceleration: ${accelList.vertMotors[1]}%</h5>`
    } else {
      motorCount.textContent = "Active Motors: Error";
      motors = [
        { id: 1, x: 200, y: 200, acceleration: { x: 0, y: 0 }, rotation: 0 }
      ];
    };

    // Define an arrow marker to draw acceleration vectors
    if (svg.select("defs").empty()) {
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
    }

    // Update groups and remove unnecessary ones
    const motorSelection = svg.selectAll("g.motor")
                              .data(motors, d => d.id);
    motorSelection.exit().remove();

    // Update existing groups
    motorSelection
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .select("rect")
      .attr("transform", d => `rotate(${d.rotation})`);

    motorSelection
      .select("line")
      .attr("x2", d => d.acceleration.x)
      .attr("y2", d => d.acceleration.y);

    motorSelection
      .select("text")
      .text(d => `Motor ${d.id}`);

    // Create groups for new data
    const motorEnter = motorSelection.enter()
                                    .append("g")
                                    .attr("class", "motor")
                                    .attr("transform", d => `translate(${d.x}, ${d.y})`);
    
    // Draw a square for each motor (rotated by the motor's rotation)
    const squareSize = 30;
    motorEnter.append("rect")
              .attr("x", -squareSize / 2)
              .attr("y", -squareSize / 2)
              .attr("width", squareSize)
              .attr("height", squareSize)
              .attr("fill", "#ccc")
              .attr("stroke", "#000")
              .attr("transform", d => `rotate(${d.rotation})`);

    // Draw an arrow representing the acceleration vector
    motorEnter.append("line")
              .attr("x1", 0)
              .attr("y1", 0)
              .attr("x2", d => d.acceleration.x)
              .attr("y2", d => d.acceleration.y)
              .attr("stroke", "red")
              .attr("stroke-width", 2)
              .attr("marker-end", "url(#arrow)");

    // Add a text label with the motor ID below each square
    motorEnter.append("text")
              .attr("x", 0)
              .attr("y", squareSize / 2 + 15)
              .attr("text-anchor", "middle")
              .attr("font-size", "12px")
              .attr("fill", "#333")
              .text(d => `Motor ${d.id}`);
  }, 500);
};

function pauseChartPID() {
  clearInterval(loopPID);
};

function pauseChartM() {
  clearInterval(loopMotor);
  isPausedMotor = true;
};

startChartPID();
startChartM();

testButton.addEventListener("click", () => {}); // For testing