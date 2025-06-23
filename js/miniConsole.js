/* Handles the text being outputted into the console */
const miniConsole = document.getElementById("outputConsole")
let firstLine = true

function startMiniConsole() {
    conUpdate = setInterval(function() {
        // Pull info from other code later
        newinfo = "pulled data"

        if (firstLine) {
            miniConsole.innerHTML += `${newinfo}`
            firstLine = false 
        } else {
            miniConsole.innerHTML += `<br> ${newinfo}`
        }
    }, 500); // Executed every 500 miliseconds
};