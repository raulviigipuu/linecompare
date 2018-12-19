
// DOM loaded
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM ready")
    let compareButton = document.getElementById("compareButton")
    compareButton.addEventListener("click", handleCompare)
})

// TODO:
// Osaliselt kattuvad read
// Mitu korda esinevad read

function handleCompare() {

    let leftTextarea = document.getElementById("leftTextarea")
    let rightTextarea = document.getElementById("rightTextarea")

    let leftLines = leftTextarea.value.split("\n").filter((line) => line.trim().length > 0)
    let rightLines = rightTextarea.value.split("\n").filter((line) => line.trim().length > 0)
    console.log("LEFT LINE COUNT: " + leftLines.length)
    console.log("RIGHT LINE COUNT: " + rightLines.length)
    let commonLines = []
    let onlyLeft = []
    let onlyRight = []
    let count = 0
    for(let i = 0; i < leftLines.length; i++) {
        count = 0
        for(let j = 0; j < rightLines.length; j++) {

            if(leftLines[i] === rightLines[j]) {
                count++
                console.log(leftLines[i])
                commonLines.push(leftLines[i])
            }
            
        }
        console.log("Element found " + count + " times.")
    }

    console.log("COMMON LINES: " + commonLines.length)
    commonLines.forEach((line) => {
        console.log(line)
    })
}
