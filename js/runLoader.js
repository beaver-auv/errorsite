/* Loads saved files of previous tests or saves the current */
const loadButton = document.getElementById("loadButton")
const saveButton = document.getElementById("saveButton")
const fileInput = document.getElementById("fileInput");

// Save Data to File
saveButton.addEventListener("click", () => {
  // Get PID Data
  const pidData = {
    labels: PID.data.labels,
    actual: PID.data.datasets[0].data,
    desired: PID.data.datasets[1].data,
  };
  
  const blob = new Blob([JSON.stringify(pidData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "subData.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Trigger file input on load button click
loadButton.addEventListener("click", () => {
  fileInput.click();
});

// Load and replay data
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      const loadedData = JSON.parse(content);
      console.log("Replayed Data:", loadedData);
      storedData = loadedData; // Replace in-memory data if needed
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };
  reader.readAsText(file);
});
