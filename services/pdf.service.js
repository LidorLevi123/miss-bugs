import PDFDocument from 'pdfkit'
import fs from 'fs'

export const pdfService = {
    buildBugsPDF,
}

function buildBugsPDF(bugs, fileName='Bugs') {
    return new Promise((resolve, reject) => {

        const doc = new PDFDocument()
    
        if (!fs.existsSync('./pdf')) {
            fs.mkdirSync('./pdf')
        }
    
        const stream = fs.createWriteStream(`pdf/${fileName}.pdf`)
        doc.pipe(stream)
    
        doc
            .font('fonts/OpenSans-Regular.ttf')
            .fontSize(20)

            bugs.forEach(bug => {
                doc.text(bug.title, { align: 'left' })
                doc.text(bug.description, { align: 'left' })
                doc.text('Severity: ' + bug.severity, { align: 'left' })
                doc.text('Created at: ' + new Date(bug.createdAt), { align: 'left' })
                doc.moveDown()
            })
    
        doc.end()
    
        stream.on('finish', ()=> {
            resolve()
        })
    })

}