/* Loads saved files of previous tests or saves the current test */
const loadButton = document.getElementById("loadButton");
const saveButton = document.getElementById("saveButton");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");
const fileInput = document.getElementById("fileInput");
const controlBar = document.getElementById("controlBar");

let replayData = [];
let replayIndex = 0;
let replayInterval = null;
let isReplaying = false;
let isLive = true;
let dataEnd = false;
const replaySpeed = 500; // In milliseconds

function showPopup() {
  controlBar.style.display = 'block';
}

// Function to hide the popup bar
function hidePopup() {
  controlBar.style.display = 'none';
}

// Save current run's data
saveButton.addEventListener("click", () => {
  const auvData = {
    labels: PID.data.labels,
    actual: PID.data.datasets[0].data,
    desired: PID.data.datasets[1].data,
    motor: motorStorage
  };

  let blob = new Blob([JSON.stringify(auvData, null, 2)], { type: "application/json" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "auv_data_run.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Load a saved file and replay it
loadButton.addEventListener("click", () => {
  fileInput.value = "";
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  let file = event.target.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = function(e) {
    try {
      let loaded = JSON.parse(e.target.result);

      // Build frame array: [{timestamp, pid, desired, motor}, ...]
      replayData = loaded.labels.map((lbl, i) => ({
        timestamp: lbl,
        pid: loaded.actual[i],
        desired: loaded.desired[i],
        motor: {
          motorOne: loaded.motor?.motorOne?.[i] ?? 0,
          motorTwo: loaded.motor?.motorTwo?.[i] ?? 0,
          motorThree: loaded.motor?.motorThree?.[i] ?? 0,
          motorFour: loaded.motor?.motorFour?.[i] ?? 0,
          motorFive: loaded.motor?.motorFive?.[i] ?? 0,
          motorSix: loaded.motor?.motorSix?.[i] ?? 0,
          motorSeven: loaded.motor?.motorSeven?.[i] ?? 0,
          motorEight: loaded.motor?.motorEight?.[i] ?? 0
        }
      }));

      // Reset charts for fresh playback
      isLive = false;
      showPopup();
      resetPIDChart();
      pauseChartPID();
      pauseChartM();
      startReplay();
    } catch (err) {
      errorHandler(`Error parsing replay file: ${err}`)
    }
  };
  reader.readAsText(file);
});

// Controls
function startReplay() {
  if (replayInterval) clearInterval(replayInterval);
  isReplaying = true;
  if (dataEnd) {
    resetPIDChart();
    replayIndex = 0;
  };
  // Begin interval
  replayInterval = setInterval(replayStep, replaySpeed);
}

playButton.addEventListener("click", () => {
  startReplay();
});

function pauseReplay() {
  if (replayInterval) clearInterval(replayInterval);
  isReplaying = false;
}

pauseButton.addEventListener("click", () => {
  pauseReplay();
});

function replayStep() {
  if (replayIndex >= replayData.length) {
    // End of data
    pauseReplay();
    dataEnd = true;
    return;
  }
  const frame = replayData[replayIndex];

  // Update PID chart
  PID.data.labels.push(frame.timestamp.toString());
  PID.data.datasets[0].data.push(frame.pid);
  PID.update();
  
  PID.data.datasets[1].data.push(frame.desired);
  PID.update("none");

  // Update motor chart
  accelList = {
    horiMotors: [
      frame.motor.motorOne,
      frame.motor.motorTwo,
      frame.motor.motorThree,
      frame.motor.motorFour
    ],
    vertMotors: [
      frame.motor.motorFive,
      frame.motor.motorSix,
      frame.motor.motorSeven,
      frame.motor.motorEight
    ]
  };

  updateMotorChart(accelList.horiMotors, accelList.vertMotors);

  replayIndex++;
}

function resetPIDChart() {
  // Clear existing data
  replayIndex = 0;
  dataEnd = false;
  timestamp = 0;
  repetitions = 1;
  PID.data.labels = [];
  PID.data.datasets[0].data = [];
  PID.data.datasets[1].data = [];
  PID.update();
}

stopButton.addEventListener("click", () => {
  isLive = true;
  isReplaying = false;
  clearInterval(replayInterval);
  clearInterval(loopPID);
  clearInterval(loopMotor);
  hidePopup();
  resetPIDChart();
  startChartPID();
  startChartM();
});