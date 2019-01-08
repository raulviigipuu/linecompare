'use strict';

const COMMON_LINES_TABLE_ID = '#commonLinesList'
const LEFT_LINES_TABLE_ID = '#leftLinesList'
const RIGHT_LINES_TABLE_ID = '#rightLinesList'

let compareB = null
//let containsB = null
let clearB = null
let leftTA = null
let rightTA = null
let leftSlashReplaceCB = null
let rightSlashReplaceCB = null

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
    compareB = document.getElementById("compareButton")
    //containsB = document.getElementById("containsButton")
    clearB = document.getElementById("clearButton")
    leftTA = document.getElementById("leftTextarea")
    rightTA = document.getElementById("rightTextarea")
    leftSlashReplaceCB = document.getElementById("leftReplaceBackslashes")
    rightSlashReplaceCB = document.getElementById("rightReplaceBackslashes")

    // Events
    compareB.addEventListener("click", handleCompare)
    //containsB.addEventListener("click", handleContains)
    clearB.addEventListener("click", handleClear)
})

function handleCompare() {

    showComparisonResults() // Make result table visible
    clearComparisonResults() // Clear previous results

    // Get the trimmed values and ignore empty lines
    let leftLines = leftTA.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())
    let rightLines = rightTA.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())

    if(leftSlashReplaceCB.checked) {
        leftLines = leftLines.map(line => line.replace(/\\/g, "/"))
    }
    if(rightSlashReplaceCB.checked) {
        rightLines = rightLines.map(line => line.replace(/\\/g, "/"))
    }

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

    // Check the right lines
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

function handleContains() {

    
}

function handleClear() {

    leftTA.value = ''
    rightTA.value = ''
    clearComparisonResults()
}

function showComparisonResults() {

    const comparisonResultElem = document.getElementById('comparisonResult')
    comparisonResultElem.classList.remove('d-none')
}

function hideComparisonResults() {


}

function clearComparisonResults() {

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
