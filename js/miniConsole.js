/* Handles the text being outputted into the console */
const miniConsole = document.getElementById("outputConsole")
let first = true

setInterval(function() {
    // Pull info from other code later
    newinfo = "pulled data"

    if (first) {
        miniConsole.innerHTML += `${newinfo}`
        first = false 
    } else {
        miniConsole.innerHTML += `<br> ${newinfo}`
    }
  }, 500); // Executed every 500 miliseconds