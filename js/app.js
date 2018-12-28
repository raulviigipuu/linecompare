'use strict';

const COMMON_LINES_TABLE_ID = '#commonLinesList'
const RIGHT_LINES_TABLE_ID = '#rightLinesList'
const LEFT_LINES_TABLE_ID = '#leftLinesList'

let data = {
    lines: {
        common: [],
        left: [],
        right: []
    }
}

let commonLines = []
let onlyLeft = []
let onlyRight = []

// DOM loaded
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM ready")
    let compareButton = document.getElementById("compareButton")
    compareButton.addEventListener("click", handleCompare)
})

// TODO:
// Osaliselt kattuvad read
// Mitu korda esinevad read

function handleCompare() {

    deleteDOMContent(COMMON_LINES_TABLE_ID)
    deleteDOMContent(RIGHT_LINES_TABLE_ID)
    deleteDOMContent(LEFT_LINES_TABLE_ID)
    commonLines = []
    onlyLeft = []
    onlyRight = []

    let leftTextarea = document.getElementById("leftTextarea")
    let rightTextarea = document.getElementById("rightTextarea")

    // Get the value and ignore empty lines
    let leftLines = leftTextarea.value.split("\n").filter((line) => line.trim().length > 0)
    let rightLines = rightTextarea.value.split("\n").filter((line) => line.trim().length > 0)

    let count = 0

    for (let i = 0; i < leftLines.length; i++) {

        if(countMatches(commonLines, leftLines[i]) > 0) {
            continue
        }

        count = 0
        for (let j = 0; j < rightLines.length; j++) {

            if (leftLines[i] === rightLines[j]) {
                count++
            }
        }
        // Match found!
        if (count != 0) {
            commonLines.push(leftLines[i])
            let leftCount = countMatches(leftLines, leftLines[i])
            addCommonRow(COMMON_LINES_TABLE_ID, {
                text: leftLines[i],
                count: count,
                leftCount: leftCount
            })
        }
        // No match, add to left lines table
        else {
            if(countMatches(onlyLeft, leftLines[i]) > 0) {
                continue
            }
            onlyLeft.push(leftLines[i])
            addRow(LEFT_LINES_TABLE_ID, {
                text: leftLines[i],
                count: countMatches(leftLines, leftLines[i])
            })
        }

        console.log("Element found " + count + " times.")
    }

    for (let i = 0; i < rightLines.length; i++) {
        count = 0
        for (let j = 0; j < leftLines.length; j++) {

            if (rightLines[i] === leftLines[j]) {
                count++
            }
        }
        // Match found
        if (count != 0) {
            // should update count
        }
        // No match, add to right lines table
        else {
            if(countMatches(onlyRight, rightLines[i])) {
                continue
            }
            onlyRight.push(rightLines[i])
            addRow(RIGHT_LINES_TABLE_ID, {
                text: rightLines[i],
                count: countMatches(rightLines, rightLines[i])
            })
        }
    }

    console.log("COMMON LINES: " + commonLines.length)
    commonLines.forEach((line) => {
        console.log(line)
    })
}

function countMatches(arr, elem) {

    let count = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === elem) {
            count++
        }
    }
    return count
}

function deleteDOMContent(parent) {
    const elem = document.querySelector(parent)
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function addRow(tableId, line) {
    const table = document.querySelector(tableId)
    const row = document.createElement('tr')
    row.innerHTML = `
        <td>${line.text}</td>
        <td>${line.count}</td>
    `
    table.appendChild(row)
}

function addCommonRow(tableId, line) {
    const table = document.querySelector(tableId)
    const row = document.createElement('tr')
    row.innerHTML = `
        <td>${line.text}</td>
        <td>${line.leftCount}</td>
        <td>${line.count}</td>
    `
    table.appendChild(row)
}
