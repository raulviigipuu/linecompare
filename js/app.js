
// DOM loaded
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM ready")
    let compareButton = document.getElementById("compareButton")
    compareButton.addEventListener("click", handleCompare)
})

function handleCompare() {

    let leftTextarea = document.getElementById("leftTextarea")
    let rightTextarea = document.getElementById("rightTextarea")

    let leftLines = leftTextarea.value.split("\n")
    console.log("LEFT LINE COUNT: " + leftLines.length)

    console.log("LEFT: " + leftTextarea.value)
    console.log("RIGHT: " + rightTextarea.value)
}
