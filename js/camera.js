/* Handles the view from the onboard camera */
const cameraDisplay = document.getElementById("cameraDisplay")

// Camera prototype
// Uses computer camera since we don't have actual camera setup yet
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    cameraDisplay.srcObject = stream;
  })
  .catch(err => errorHandler(`Camera error: ${err}`));