/* Handles the text being outputted into the console */
const miniConsole = document.getElementById("outputConsole");
let firstLine = true;
let newInfo = "";

function startMiniConsole() {
    conUpdate = setInterval(function() {        
        if (newInfo == "") {} else if (firstLine) {
            miniConsole.innerHTML += `${newInfo}`
            firstLine = false 
            newInfo = "";
        } else {
            miniConsole.innerHTML += `<br> ${newInfo}`
            newInfo = "";
        }
    }, 500); // Executed every 500 miliseconds
};

startMiniConsole();