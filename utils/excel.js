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

export function exportRegistryWorkbook({ assessors, moderators, learners }) {
  const assessorSheet = XLSX.utils.json_to_sheet(assessors)
  const moderatorSheet = XLSX.utils.json_to_sheet(moderators)
  const learnerSheet = XLSX.utils.json_to_sheet(learners)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, assessorSheet, 'Assessors')
  XLSX.utils.book_append_sheet(workbook, moderatorSheet, 'Moderators')
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

export function downloadBulkTemplate(target = 'learners') {
  const isLearner = target === 'learners'
  const sheet = XLSX.utils.json_to_sheet(
    isLearner
      ? [
          {
            Name: 'Aisha Mthembu',
            IDNumber: '9901014800086',
            PassportNumber: '',
            Country: 'South Africa',
            DocumentType: '',
          },
          {
            Name: 'Daniel Okoro',
            IDNumber: '',
            PassportNumber: 'A1234567',
            Country: 'Nigeria',
            DocumentType: 'Passport',
          },
        ]
      : [
          {
            Name: 'Naledi Mokoena',
            Role: 'Assessor',
            IDNumber: '9001014800088',
            PassportNumber: '',
            Country: 'South Africa',
            DocumentType: '',
          },
          {
            Name: 'Amelia Govender',
            Role: 'Moderator',
            IDNumber: '',
            PassportNumber: 'P1234567',
            Country: 'Botswana',
            DocumentType: 'Passport',
          },
        ],
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(
    workbook,
    sheet,
    isLearner ? 'Learner Upload Template' : 'Assessor & Moderator Template',
  )

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = isLearner ? 'learner-bulk-template.xlsx' : 'assessor-moderator-template.xlsx'
  link.click()
  URL.revokeObjectURL(url)
}
