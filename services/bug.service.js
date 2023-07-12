// BACKEND SERVICE
import fs from 'fs'
import { utilService } from './util.service.js'

export const bugService = {
    query,
    get,
    remove,
    save,
}

const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy) {
    if (!filterBy) return Promise.resolve(bugs)
    // Filter
    const regex = new RegExp(filterBy.title, 'i')

    let filteredBugs =
        bugs.filter(bug =>
            regex.test(bug.title) &&
            bug.severity >= filterBy.minSeverity &&
            bug.labels.some(label => label.includes(filterBy.label))
        )
    // Sort
    filterBy.isDescending = (filterBy.isDescending === 'true') ? true : false
    const desc = filterBy.isDescending ? 1 : -1

    if (filterBy.sortBy === 'title') {
        filteredBugs.sort((b1, b2) => b1.title.localeCompare(b2.title) * desc)

    } else if (filterBy.sortBy === 'severity') {
        filteredBugs.sort((b1, b2) => (b1.severity - b2.severity) * desc)

    } else if (filterBy.sortBy === 'createdAt') {
        filteredBugs.sort((b1, b2) => (b1.createdAt - b2.createdAt) * desc)

    } else {
        filteredBugs.sort()
    }

    // Paging
    filterBy.isPagingUsed = (filterBy.isPagingUsed === 'true') ? true : false
    const { isPagingUsed, pageSize, pageIdx } = filterBy

    if (pageIdx !== undefined && isPagingUsed) {
        const startPageIdx = pageIdx * pageSize
        filteredBugs = filteredBugs.slice(startPageIdx, startPageIdx + pageSize)
    }

    return Promise.resolve(filteredBugs)
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedInUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No Such Bug')
    const bug = bugs[idx]
    if (!loggedInUser.isAdmin && 
        bug.creator._id !== loggedInUser._id) return Promise.reject('Not Your Bug')
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedInUser) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (idx === -1) throw new Error('Couldn\'t find bug')
        if (!loggedInUser.isAdmin && 
            bugs[idx].creator._id !== loggedInUser._id) return Promise.reject('Not Your Bug')
        bugs[idx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bug.creator = loggedInUser
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}