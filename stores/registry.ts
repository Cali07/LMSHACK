import { defineStore } from 'pinia'
import { mockFlagUpdate, mockRegisterAssessorModerator, mockRegisterLearner } from '~/utils/mockApi'

type IdentityCheck = {
  valid: boolean
  isSouthAfrican: boolean
  age: number | null
  gender: string
  reason?: string
}

type RegistryRecord = {
  id: string
  name: string
  idNumber?: string
  passportNumber?: string
  country?: string
  documentType?: string
  email?: string
  motivation?: string
  role: string
  age: number | null
  gender: string
  status: 'verified' | 'failed' | 'flagged' | 'pending'
  failedReason?: string
  flagged: boolean
}

function calculateAge(dateString: string): number | null {
  const today = new Date()
  const birthDate = new Date(dateString)
  if (Number.isNaN(birthDate.getTime())) return null
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export const useRegistryStore = defineStore('registry', {
  state: () => ({
    assessors: [
      {
        id: 'ASM-1001',
        name: 'Naledi Mokoena',
        idNumber: '9001014800088',
        role: 'Assessor',
        age: 34,
        gender: 'Female',
        status: 'verified',
        failedReason: '',
        flagged: false,
        email: 'naledi@example.com',
        motivation: 'Experienced retail assessor',
      },
      {
        id: 'ASM-1002',
        name: 'Sizwe Dlamini',
        idNumber: '8202155254087',
        role: 'Assessor',
        age: 42,
        gender: 'Male',
        status: 'failed',
        failedReason: 'Unable to confirm ID checksum',
        flagged: true,
        email: 'sizwe@example.com',
        motivation: 'Specialist in workplace moderation',
      },
    ] as RegistryRecord[],
    moderators: [
      {
        id: 'MOD-2001',
        name: 'Amelia Govender',
        idNumber: '8712310456081',
        role: 'Moderator',
        age: 36,
        gender: 'Female',
        status: 'verified',
        failedReason: '',
        flagged: false,
        email: 'amelia@example.com',
        motivation: 'Accredited moderator across retail learnerships',
      },
    ] as RegistryRecord[],
    learners: [
      {
        id: 'LRN-3001',
        name: 'Thabo Nkosi',
        idNumber: '0412235155082',
        role: 'Learner',
        age: 19,
        gender: 'Male',
        status: 'pending',
        failedReason: 'Awaiting certified ID copy',
        flagged: false,
      },
      {
        id: 'LRN-3002',
        name: 'Maria Gomez',
        passportNumber: 'P8988221',
        country: 'Namibia',
        documentType: 'Passport',
        role: 'Learner',
        age: null,
        gender: 'Unspecified',
        status: 'pending',
        failedReason: 'Non-SA document requires verification',
        flagged: false,
      },
    ] as RegistryRecord[],
  }),
  getters: {
    assessorModeratorList(state) {
      return [...state.assessors, ...state.moderators]
    },
  },
  actions: {
    validateSouthAfricanId(idNumber?: string): IdentityCheck {
      if (!idNumber) {
        return {
          valid: false,
          isSouthAfrican: false,
          age: null,
          gender: 'Unspecified',
          reason: 'No ID number provided',
        }
      }

      const cleaned = idNumber.replace(/\D/g, '')
      if (cleaned.length !== 13) {
        return {
          valid: false,
          isSouthAfrican: false,
          age: null,
          gender: 'Unspecified',
          reason: 'Non-South African ID or incorrect length',
        }
      }

      const birth = cleaned.substring(0, 6)
      const year = parseInt(birth.substring(0, 2), 10)
      const month = parseInt(birth.substring(2, 4), 10) - 1
      const day = parseInt(birth.substring(4, 6), 10)
      const currentYearTwo = parseInt(new Date().getFullYear().toString().slice(-2), 10)
      const century = year > currentYearTwo ? 1900 : 2000
      const dateString = `${century + year}-${String(month + 1).padStart(2, '0')}-${
        String(day).padStart(2, '0')
      }`
      const age = calculateAge(dateString)
      const genderDigits = parseInt(cleaned.substring(6, 10), 10)
      const gender = Number.isNaN(genderDigits) ? 'Unspecified' : genderDigits >= 5000 ? 'Male' : 'Female'

      const validDate = age !== null && age > 0 && age < 120
      const citizenshipDigit = cleaned[10]
      const isCitizen = citizenshipDigit === '0' || citizenshipDigit === '1'
      const valid = validDate && isCitizen

      return {
        valid,
        isSouthAfrican: true,
        age: age ?? null,
        gender,
        reason: valid ? undefined : 'ID structure failed validation checks',
      }
    },

    async registerAssessorOrModerator(payload: {
      name: string
      idNumber?: string
      passportNumber?: string
      country?: string
      documentType?: string
      email?: string
      motivation?: string
      role: 'Assessor' | 'Moderator'
    }) {
      const validation = this.validateSouthAfricanId(payload.idNumber)
      const identifier = payload.idNumber || payload.passportNumber

      if (!identifier) {
        return { success: false, message: 'An ID or passport number is required.' }
      }

      const duplicate = this.assessorModeratorList.find(
        (person) => person.idNumber === payload.idNumber || person.passportNumber === payload.passportNumber,
      )
      if (duplicate) {
        return { success: false, message: 'A record already exists for this ID or passport.' }
      }

      if (!validation.isSouthAfrican && (!payload.passportNumber || !payload.country || !payload.documentType)) {
        return {
          success: false,
          message: 'Additional verification details are required for non-South African IDs.',
        }
      }

      const status: RegistryRecord['status'] = validation.valid
        ? 'verified'
        : validation.isSouthAfrican
          ? 'failed'
          : 'pending'

      const failedReason =
        status === 'failed'
          ? validation.reason || 'ID validation failed'
          : !validation.isSouthAfrican
            ? 'Identity verification required for non-South African document'
            : ''

      const record: RegistryRecord = {
        id: '',
        name: payload.name,
        idNumber: payload.idNumber,
        passportNumber: payload.passportNumber,
        country: payload.country,
        documentType: payload.documentType,
        email: payload.email,
        motivation: payload.motivation,
        role: payload.role,
        age: validation.age,
        gender: validation.gender,
        status,
        failedReason,
        flagged: status === 'failed',
      }

      const saved = await mockRegisterAssessorModerator(record)

      if (payload.role === 'Moderator') {
        this.moderators.unshift(saved)
      } else {
        this.assessors.unshift(saved)
      }

      return { success: true, record: saved }
    },

    async registerLearner(payload: {
      name: string
      idNumber?: string
      passportNumber?: string
      country?: string
      documentType?: string
      flagged?: boolean
    }) {
      const validation = this.validateSouthAfricanId(payload.idNumber)
      const identifier = payload.idNumber || payload.passportNumber

      if (!identifier) {
        return { success: false, message: 'An ID or passport number is required.' }
      }

      const duplicate = this.learners.find(
        (learner) => learner.idNumber === payload.idNumber || learner.passportNumber === payload.passportNumber,
      )
      if (duplicate) {
        return { success: false, message: 'A learner already exists with that ID or passport.' }
      }

      if (!validation.isSouthAfrican && (!payload.passportNumber || !payload.country || !payload.documentType)) {
        return {
          success: false,
          message: 'Non-South African learners require document type, country, and passport details.',
        }
      }

      const status: RegistryRecord['status'] = validation.valid
        ? 'verified'
        : validation.isSouthAfrican
          ? 'failed'
          : 'pending'

      const failedReason =
        status === 'failed'
          ? validation.reason || 'ID validation failed'
          : !validation.isSouthAfrican
            ? 'Identity verification required for non-South African document'
            : ''

      const record: RegistryRecord = {
        id: '',
        name: payload.name,
        idNumber: payload.idNumber,
        passportNumber: payload.passportNumber,
        country: payload.country,
        documentType: payload.documentType,
        role: 'Learner',
        age: validation.age,
        gender: validation.gender,
        status,
        failedReason,
        flagged: payload.flagged ?? status === 'failed',
      }

      const saved = await mockRegisterLearner(record)
      this.learners.unshift(saved)
      return { success: true, record: saved }
    },

    async flagRecord(collection: 'assessors' | 'moderators' | 'learners', id: string, reason: string) {
      const group = this[collection] as RegistryRecord[]
      const target = group.find((entry) => entry.id === id)
      if (!target) return { success: false, message: 'Record not found' }

      target.flagged = true
      target.status = 'flagged'
      target.failedReason = reason

      await mockFlagUpdate(target)
      return { success: true, record: target }
    },
  },
})
