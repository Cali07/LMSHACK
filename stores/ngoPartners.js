import { defineStore } from 'pinia'

export const useNgoPartnersStore = defineStore('ngoPartners', {
  state: () => ({
    stats: [
      { title: 'Meals served to date', value: '372 million', icon: 'mdi-food-apple-outline' },
      { title: 'Years of nourishment', value: '16 years', icon: 'mdi-timeline-clock-outline' },
      { title: 'Community partners', value: '126+ NPOs', icon: 'mdi-handshake-outline' },
      { title: 'Funds raised so far', value: 'R1.2 billion', icon: 'mdi-currency-usd' },
    ],
    spotlightVideos: [
      {
        title: 'Hope in Action',
        description: 'A glimpse into the daily work of our community kitchens and child nutrition hubs.',
        url: 'https://www.youtube.com/embed/r7KvkaFeYMk?si=Y8_Ge9eMRuLUsOC5'
      },
      {
        title: 'Partners on the Ground',
        description: 'Meet the AddHope partners who serve balanced meals every day.',
        url: 'https://www.youtube.com/embed/yUFbwc86pdA?si=TCLrUB52n_Gkvsjy'
      }
    ],
    testimonials: [
      {
        quote: 'The AddHope grant helped us extend our feeding scheme to three more schools in Soweto.',
        partner: 'Lufuno Youth Kitchen'
      },
      {
        quote: 'With KFC AddHope we serve dignity with every meal and see school attendance rise.',
        partner: 'Ikamva LeZwe Foundation'
      },
      {
        quote: 'Our children get a warm plate and a safe place to dream bigger.',
        partner: 'Ubuntu Community Trust'
      }
    ],
    requirements: [
      'Registered NPO/NPC/PBO/Trust operating legitimately for more than 2 years.',
      'Beneficiaries should be children and youth between 0 – 18 years.',
      'Provide supporting documents: Registration certificate, Constitution, Board of Management, Financial Advisor/Bookkeeper confirmation, Audited Financials and Health Certificate.',
      'Submit a motivational letter describing the community challenge and how AddHope will amplify your impact.'
    ],
    contact: {
      email: 'za-addhope@yum.com',
      faq: 'https://purpose.kfc.co.za/add-hope/frequently-asked-questions/'
    },
    subscribedEmails: [],
    applications: [],
    lastSubmittedApplication: null,
    engagementLog: []
  }),
  getters: {
    heroStatHighlight: (state) => state.stats[0] || null
  },
  actions: {
    subscribeEmail(email) {
      if (!email) {
        return { success: false, message: 'Please provide a valid email address.' }
      }
      const normalised = email.trim().toLowerCase()
      const alreadySubscribed = this.subscribedEmails.includes(normalised)
      if (alreadySubscribed) {
        return { success: false, message: 'That email is already part of our NGO circle.' }
      }
      this.subscribedEmails.push(normalised)
      return { success: true, message: 'Thank you! We will be in touch with partnership opportunities.' }
    },
    submitApplication(payload) {
      const stamped = { ...payload, submittedAt: new Date().toISOString() }
      this.applications.push(stamped)
      this.lastSubmittedApplication = stamped
      return { success: true }
    },
    recordEngagement(type, meta = {}) {
      this.engagementLog.push({
        type,
        meta,
        at: new Date().toISOString()
      })
    }
  }
})
