import { defineStore } from 'pinia'

export const usePartnerOnboardingStore = defineStore('partnerOnboarding', {
  state: () => ({
    hero: {
      title: 'Grow hope with your brand',
      subtitle: 'Partner with KFC AddHope and turn every campaign into a meal for a child.'
    },
    benefits: [
      {
        title: 'Amplified Reach',
        description: 'Appear in the national AddHope partner directory and reach thousands of conscious consumers.',
        icon: 'mdi-bullhorn-variant-outline'
      },
      {
        title: 'Shared Storytelling',
        description: 'We co-create content that celebrates your impact and keeps your audience engaged.',
        icon: 'mdi-account-group-outline'
      },
      {
        title: 'Meaningful Conversions',
        description: 'Offer exclusive coupon codes that unlock donations and tangible results.',
        icon: 'mdi-ticket-percent-outline'
      }
    ],
    impactHighlights: [
      { label: 'Average uplift in partner reach', value: '48%' },
      { label: 'Meals unlocked by partner coupons in 2023', value: '5.6M' },
      { label: 'Communities reached through partner activations', value: '220+' }
    ],
    successStories: [
      {
        headline: 'Quick service brand sees 2x engagement',
        detail: 'After launching an AddHope combo, in-store foot traffic spiked and 120 000 extra meals were funded in six weeks.'
      },
      {
        headline: 'Retail partner turns loyalty points into nourishment',
        detail: 'Customers redeemed coupons that channeled R2.1 million directly into provincial feeding schemes.'
      }
    ],
    shareIdeas: [
      {
        title: 'Social media spotlight',
        description: 'Publish your AddHope coupon on Instagram, Facebook and TikTok with assets we provide.',
        icon: 'mdi-instagram'
      },
      {
        title: 'Staff champion programme',
        description: 'Equip your teams with stories and talking points so they proudly advocate for the campaign.',
        icon: 'mdi-account-tie-voice'
      },
      {
        title: 'In-store call to action',
        description: 'Place AddHope kiosks and QR codes for easy customer donations after their purchase.',
        icon: 'mdi-qrcode-scan'
      }
    ],
    donationPrompt: {
      title: 'Your donation changes lives',
      message: 'After you apply, keep the momentum by donating a meal. Every R2 adds another plate of hope.'
    },
    applications: [],
    engagementLog: []
  }),
  actions: {
    submitApplication(payload) {
      const submission = { ...payload, submittedAt: new Date().toISOString() }
      this.applications.push(submission)
      this.engagementLog.push({
        type: 'application',
        meta: { companyName: payload.companyName },
        at: submission.submittedAt
      })
      return { success: true }
    }
  }
})
