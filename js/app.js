'use strict';

const ID = {
    comparison: {
        resultsTable: 'comparisonResult',
        results: {
            common: 'commonLinesList',
            left: 'leftLinesList',
            right: 'rightLinesList'
        }
    },
    contains: {
        resultsTable: 'containsResult',
        results: 'containsLinesList'
    }
}

let compareB = null
let containsB = null
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
    containsB = document.getElementById("containsButton")
    clearB = document.getElementById("clearButton")
    leftTA = document.getElementById("leftTextarea")
    rightTA = document.getElementById("rightTextarea")
    leftSlashReplaceCB = document.getElementById("leftReplaceBackslashes")
    rightSlashReplaceCB = document.getElementById("rightReplaceBackslashes")

    // Events
    compareB.addEventListener("click", handleCompare)
    containsB.addEventListener("click", handleContains)
    clearB.addEventListener("click", handleCompClear)
})

function handleCompare() {

    hide(ID.contains.resultsTable)
    show(ID.comparison.resultsTable) // Make result table visible
    clearComparisonResults() // Clear previous results

    // Get the trimmed values and ignore empty lines
    let leftLines = leftTA.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())
    let rightLines = rightTA.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())

    if (leftSlashReplaceCB.checked) {
        leftLines = leftLines.map(line => line.replace(/\\/g, "/"))
    }
    if (rightSlashReplaceCB.checked) {
        rightLines = rightLines.map(line => line.replace(/\\/g, "/"))
    }

    let count = 0

    for (let i = 0; i < leftLines.length; i++) {

        if (countMatches(commonLines, leftLines[i]) > 0) {
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
            addCommonRow(ID.comparison.results.common, {
                text: leftLines[i],
                originCount: originCount,
                matchCount: count
            })
        }
        // No match, add to left lines table
        else {
            if (countMatches(onlyLeft, leftLines[i]) > 0) {
                continue
            }
            onlyLeft.push(leftLines[i])
            addRow(ID.comparison.results.left, {
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
            if (countMatches(onlyRight, rightLines[i])) {
                continue
            }
            onlyRight.push(rightLines[i])
            addRow(ID.comparison.results.right, {
                text: rightLines[i],
                count: countMatches(rightLines, rightLines[i])
            })
        }
    }
}

function handleContains() {

    hide(ID.comparison.resultsTable)
    show(ID.contains.resultsTable)
    deleteDOMContent(ID.contains.results)

    let searchTerms = leftTA.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())
    let lines = rightTA.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())
    for (let i = 0; i < searchTerms.length; i++) {

        let searchTerm = searchTerms[i]
        let results = search(searchTerm, lines)

        addContainsRow(ID.contains.results, {
            nr: i + 1,
            text: searchTerms[i],
            count: results.count,
            lines: results.lines
        })
    }
}

function search(term, linesArr) {

    let count = 0;
    let lines = []
    // Counts how many lines has term string in them
    for(let i = 0; i < linesArr.length; i++) {
        
        if(linesArr[i].indexOf(term) != -1) {
            count++;
            lines.push({
                lineNr: i + 1,
                lineText: highlightTerms(term, linesArr[i])
            })
        }
    }

    return { count: count, lines: lines}
}

function highlightTerms(term, line) {

    // <label class='font-weight-bold'>
    let result = ""
    let arr = line.split(term)

    for(let i = 0; i < arr.length; i++) {

        // Check if not last element
        if(i != arr.length - 1) {
            result += arr[i] + '<label class="font-weight-bold">' + term + '</label>'
        } else {
            result += arr[i]
        }
    }

    return result
}

function handleCompClear() {

    leftTA.value = ''
    rightTA.value = ''
    clearComparisonResults()
    hide(ID.comparison.resultsTable)
}

function handleContainsClear() {

    leftTA.value = ''
    rightTA.value = ''
    clearContainsResults()
    hide(ID.contains.resultsTable)
}

function show(elemId) {
    document.getElementById(elemId).classList.remove('d-none')
}

function hide(elemId) {
    document.getElementById(elemId).classList.add('d-none')
}

// TODO: unify clear - id array for dom delete + data section 
function clearContainsResults() {
    console.log("Doing nothing")
}

function clearComparisonResults() {

    deleteDOMContent(ID.comparison.results.common)
    deleteDOMContent(ID.comparison.results.left)
    deleteDOMContent(ID.comparison.results.right)
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
    const elem = document.getElementById(parent)
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function addContainsRow(tableId, line) {
    const table = document.getElementById(tableId)
    const row = document.createElement('tr')
    row.classList.add('d-flex')
    row.innerHTML = `
        <th scope="row">${line.nr}.</th>
        <td class="col-sm-3">${line.text}</td>
        <td class="col-sm-1">${line.count}</td>
        <td class="col-sm-8">${addContainsRowLines(line.lines)}</td>
    `
    table.appendChild(row)
}
// lines array contains objects with properties lineNr and lineText
function addContainsRowLines(lines) {

    let htmlStr = ""
    for(let i = 0; i < lines.length; i++) {
        if(htmlStr.length > 0) {
            htmlStr += "<br>"
        }
        htmlStr += `${lines[i].lineNr}. `
        htmlStr += `${lines[i].lineText}`
    }
    htmlStr += '</span>'

    return htmlStr
}

function addRow(tableId, line) {
    const table = document.getElementById(tableId)
    const row = document.createElement('tr')
    row.classList.add('d-flex')
    row.innerHTML = `
        <td class="col-sm-10">${line.text}</td>
        <td class="col-sm-2 text-center">${line.count}</td>
    `
    table.appendChild(row)
}

function addCommonRow(tableId, line) {
    const table = document.getElementById(tableId)
    const row = document.createElement('tr')
    row.classList.add('d-flex')
    row.innerHTML = `
        <td class="col-sm-8">${line.text}</td>
        <td class="col-sm-2 text-center">${line.originCount}</td>
        <td class="col-sm-2 text-center">${line.matchCount}</td>
    `
    table.appendChild(row)
}
