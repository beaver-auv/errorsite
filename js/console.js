/* Handles the text being outputted into the console */
const console = document.getElementById("outputConsole")
let first = true

setInterval(function() {
    // Pull info from other code later
    newinfo = "pulled data"

    if (first) {
        console.innerHTML += `${newinfo}`
        first = false 
    } else {
        console.innerHTML += `<br> ${newinfo}`
    }
  }, 500); // Executed every 500 miliseconds