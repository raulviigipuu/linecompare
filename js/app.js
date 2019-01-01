'use strict';

const COMMON_LINES_TABLE_ID = '#commonLinesList'
const LEFT_LINES_TABLE_ID = '#leftLinesList'
const RIGHT_LINES_TABLE_ID = '#rightLinesList'

let compareButton = null
let clearButton = null
let leftTextarea = null
let rightTextarea = null

let commonLines = []
let onlyLeft = []
let onlyRight = []

// draft
let data = {
    lines: {
        common: [],
        left: [],
        right: []
    }
}

// DOM loaded
document.addEventListener("DOMContentLoaded", function (event) {

    console.log("DOM ready")

    // Elements
    compareButton = document.getElementById("compareButton")
    clearButton = document.getElementById("clearButton")
    leftTextarea = document.getElementById("leftTextarea")
    rightTextarea = document.getElementById("rightTextarea")

    // Events
    compareButton.addEventListener("click", handleCompare)
    clearButton.addEventListener("click", handleClear)
})

function handleCompare() {

    clearResults() // Clear previous results

    // Get the values and ignore empty lines
    let leftLines = leftTextarea.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())
    let rightLines = rightTextarea.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())

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
            let originCount = countMatches(leftLines, leftLines[i])
            addCommonRow(COMMON_LINES_TABLE_ID, {
                text: leftLines[i],
                originCount: originCount,
                matchCount: count
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
    }

    for (let i = 0; i < rightLines.length; i++) {
        count = 0
        for (let j = 0; j < leftLines.length; j++) {

            if (rightLines[i] === leftLines[j]) {
                count++
            }
        }
        // Match found
        if (count == 0) {
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
}

function handleClear() {

    leftTextarea.value = ''
    rightTextarea.value = ''
    clearResults()
}

function clearResults() {

    deleteDOMContent(COMMON_LINES_TABLE_ID)
    deleteDOMContent(RIGHT_LINES_TABLE_ID)
    deleteDOMContent(LEFT_LINES_TABLE_ID)
    commonLines = []
    onlyLeft = []
    onlyRight = []
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
    row.classList.add('d-flex')
    row.innerHTML = `
        <td class="col-sm-10">${line.text}</td>
        <td class="col-sm-2 text-center">${line.count}</td>
    `
    table.appendChild(row)
}

function addCommonRow(tableId, line) {
    const table = document.querySelector(tableId)
    const row = document.createElement('tr')
    row.classList.add('d-flex')
    row.innerHTML = `
        <td class="col-sm-8">${line.text}</td>
        <td class="col-sm-2 text-center">${line.originCount}</td>
        <td class="col-sm-2 text-center">${line.matchCount}</td>
    `
    table.appendChild(row)
}
