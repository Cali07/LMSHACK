import * as XLSX from 'xlsx'

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(firstSheet)
        resolve(json)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function exportRegistryWorkbook({ assessors, learners }) {
  const assessorSheet = XLSX.utils.json_to_sheet(assessors)
  const learnerSheet = XLSX.utils.json_to_sheet(learners)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, assessorSheet, 'Assessors & Moderators')
  XLSX.utils.book_append_sheet(workbook, learnerSheet, 'Learners')

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'wrseta-registry.xlsx'
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadLearnerTemplate() {
  const sheet = XLSX.utils.json_to_sheet([
    {
      Name: 'Aisha Mthembu',
      IDNumber: '9901014800086',
      PassportNumber: '',
      Country: 'South Africa',
      DocumentType: 'ID',
      Flagged: 'false',
    },
    {
      Name: 'Daniel Okoro',
      IDNumber: '',
      PassportNumber: 'A1234567',
      Country: 'Nigeria',
      DocumentType: 'Passport',
      Flagged: 'false',
    },
    {
      Name: 'Ingrid Müller',
      IDNumber: '',
      PassportNumber: 'C9876543',
      Country: 'Germany',
      DocumentType: 'Passport',
      Flagged: 'true',
    },
  ])

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Learner Upload Template')

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'learner-bulk-template.xlsx'
  link.click()
  URL.revokeObjectURL(url)
}
