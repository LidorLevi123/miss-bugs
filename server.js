import cookieParser from 'cookie-parser'
import express from 'express'
import path from 'path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from './services/pdf.service.js'
import { utilService } from './public/js/services/util.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()

// Express Config:
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))

// Download Bugs
app.get('/api/download', (req, res) => {
    bugService.query()
        .then((bugs) => {
            loggerService.info(`Downloaded Bugs`)
            const fileName = `bugs-${utilService.makeId()}`
            pdfService.buildBugsPDF(bugs, fileName)
            .then(()=> {
                        const filePath = path.join(__dirname, 'pdf', `${fileName}.pdf`)
                        res.sendFile(filePath)
                    })
            })
            .catch(err => {
                loggerService.error('Cannot download Bugs', err)
                res.status(400).send('Cannot download Bugs')
            })
})

// Express Routing:

// Get Bug (READ)
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    const visitedBugs =
        req.cookies.visitedBugs ? JSON.parse(req.cookies.visitedBugs) : []

    if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit!')

    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }

    res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7 * 1000 })

    bugService.get(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    const filterBy = { 
        isPagingUsed: req.query.isPagingUsed || true,
        pageSize: req.query.pageSize || 3,
        pageIdx: req.query.pageIdx || 0,
        title: req.query.title || '',
        minSeverity: req.query.minSeverity || '', 
        label: req.query.label || '',
        sortBy: req.query.sortBy || '',
        isDescending: req.query.isDescending || false, 
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Save Bugs (UPDATE)
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const { _id, title, description, severity, createdAt, labels, creator } = req.body
    const bugToSave = {
        _id,
        title,
        description,
        severity,
        createdAt,
        labels,
        creator
    }

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => {
            loggerService.info('Bug saved!', savedBug)
            res.send(savedBug)
        })
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Save Bugs (CREATE)
app.post('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const { _id, title, description, severity, createdAt, labels } = req.body
    const bugToSave = {
        _id,
        title,
        description,
        severity,
        createdAt,
        labels
    }
    
    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => {
            loggerService.info('Bug saved!', savedBug)
            res.send(savedBug)
        })
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Remove Bug (READ)
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const { bugId } = req.params

    bugService.remove(bugId, loggedinUser)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`Bug ${bugId} removed`)
        })
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

// User Login
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
        .catch(err => {
            console.log('Cannot login', err)
            res.status(400).send('Cannot login')
        })
})

// User Signup
app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

// User Logout
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.end()
})

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))