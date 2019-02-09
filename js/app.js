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

let DATA = {
    comparison: {
        results: {
            common: [],
            left: [],
            right: []
        }
    }
}

let ELEM = {
    b: { // buttons
        compare: null,
        contains: null,
        clear: null
    },
    ta: { // textareas
        left: null,
        right: null
    },
    cb: { // checkboxes
        leftSlashReplace: null,
        rightSlashReplace: null
    }
}

class Element {

    static hide(elemId) {
        let elem = document.getElementById(elemId)
        if( ! elem.classList.contains('d-none')) {
            elem.classList.add('d-none')
        }
    }

    static show(elemId) {
        let elem = document.getElementById(elemId)
        if(elem.classList.contains('d-none')) {
            elem.classList.remove('d-none')
        }
    }
}

class Handler {
 
    static compare() {

        Cleaner.cleanResults()
        Element.show(ID.comparison.resultsTable)
    
        const linesAll = getLines()
        const leftLines = linesAll.left
        const rightLines = linesAll.right
    
        let count = 0
        for (let i = 0; i < leftLines.length; i++) {
    
            if (countMatches(DATA.comparison.results.common, leftLines[i]) > 0) {
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
                DATA.comparison.results.common.push(leftLines[i])
                let originCount = countMatches(leftLines, leftLines[i])
                addCommonRow(ID.comparison.results.common, {
                    text: leftLines[i],
                    originCount: originCount,
                    matchCount: count
                })
            }
            // No match, add to left lines table
            else {
                if (countMatches(DATA.comparison.results.left, leftLines[i]) > 0) {
                    continue
                }
                DATA.comparison.results.left.push(leftLines[i])
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
                if (countMatches(DATA.comparison.results.right, rightLines[i])) {
                    continue
                }
                DATA.comparison.results.right.push(rightLines[i])
                addRow(ID.comparison.results.right, {
                    text: rightLines[i],
                    count: countMatches(rightLines, rightLines[i])
                })
            }
        }
    }

    static contains() {

        Cleaner.cleanResults()
        Element.show(ID.contains.resultsTable)
    
        const linesAll = getLines()
        const searchTerms = linesAll.left
        const lines = linesAll.right

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

    static clear() {

        Cleaner.cleanInput()
        Cleaner.cleanResults()
    }
}

class Cleaner {

    static cleanResults() {

        this.clearContent([
            ID.comparison.results.common, 
            ID.comparison.results.left, 
            ID.comparison.results.right,
            ID.contains.results
        ])

        DATA.comparison.results.common = []
        DATA.comparison.results.left = []
        DATA.comparison.results.right = []

        Element.hide(ID.comparison.resultsTable)
        Element.hide(ID.contains.resultsTable)
    }

    static cleanInput() {

        ELEM.ta.left.value = ''
        ELEM.ta.right.value = ''
    }

    static deleteDOMContent(elemId) {
        const elem = document.getElementById(elemId)
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }

    static clearContent(idArr) {

        idArr.forEach(e => this.deleteDOMContent(e))
    }

    static clearData(dataArr) {
        
        dataArr.forEach(e => e = [])
    }
}

// DOM loaded
document.addEventListener("DOMContentLoaded", function (event) {

    console.log("DOM ready")

    // Elements
    ELEM.b.compare = document.getElementById("compareButton")
    ELEM.b.contains = document.getElementById("containsButton")
    ELEM.b.clear = document.getElementById("clearButton")
    ELEM.ta.left = document.getElementById("leftTextarea")
    ELEM.ta.right = document.getElementById("rightTextarea")
    ELEM.cb.leftSlashReplace = document.getElementById("leftReplaceBackslashes")
    ELEM.cb.rightSlashReplace = document.getElementById("rightReplaceBackslashes")

    // Events
    ELEM.b.compare.addEventListener("click", Handler.compare)
    ELEM.b.contains.addEventListener("click", Handler.contains)
    ELEM.b.clear.addEventListener("click", Handler.clear)
})

function getLines() {

    // Get the trimmed values and ignore empty lines
    let leftLines = ELEM.ta.left.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())
    let rightLines = ELEM.ta.right.value.split("\n").filter((line) => line.trim().length > 0).map(line => line.trim())

    if (ELEM.cb.leftSlashReplace.checked) {
        leftLines = leftLines.map(line => line.replace(/\\/g, "/"))
    }
    if (ELEM.cb.rightSlashReplace.checked) {
        rightLines = rightLines.map(line => line.replace(/\\/g, "/"))
    }
        

    return {
        left: leftLines,
        right: rightLines
    }
}

function search(term, linesArr) {

    let count = 0;
    let lines = []
    // Counts how many lines has term string in them
    for (let i = 0; i < linesArr.length; i++) {

        if (linesArr[i].indexOf(term) != -1) {
            count++;
            lines.push({
                lineNr: i + 1,
                lineText: highlightTerms(term, linesArr[i])
            })
        }
    }

    return { count: count, lines: lines }
}

function highlightTerms(term, line) {

    let result = ""
    let arr = line.split(term)

    for (let i = 0; i < arr.length; i++) {

        // Check if not last element
        if (i != arr.length - 1) {
            result += arr[i] + '<label class="font-weight-bold">' + term + '</label>'
        } else {
            result += arr[i]
        }
    }

    return result
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
    for (let i = 0; i < lines.length; i++) {
        if (htmlStr.length > 0) {
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
