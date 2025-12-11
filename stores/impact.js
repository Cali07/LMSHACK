import { defineStore } from 'pinia'

export const useImpactStore = defineStore('impact', {
  state: () => ({
    headlineStats: [
      { title: 'Meals served this week', value: '812 430', icon: 'mdi-food' },
      { title: 'Children reached daily', value: '150 000+', icon: 'mdi-school-outline' },
      { title: 'Volunteer hours logged', value: '3 240', icon: 'mdi-account-heart-outline' },
      { title: 'Provinces supported', value: '9', icon: 'mdi-map-legend' }
    ],
    fundAllocation: [
      { category: 'Nutritious meals', percentage: 54, description: 'Staple ingredients, fresh produce and proteins delivered to feeding centres.' },
      { category: 'Logistics & delivery', percentage: 18, description: 'Cold-chain transport, packaging and last mile coordination.' },
      { category: 'Training & compliance', percentage: 12, description: 'Food safety, nutrition education and monitoring support for partners.' },
      { category: 'Emergency response', percentage: 9, description: 'Rapid relief for disaster-affected communities and school closures.' },
      { category: 'Community upliftment', percentage: 7, description: 'Kitchen upgrades, food garden grants and youth micro-enterprise support.' }
    ],
    transparencyNotes: {
      lastAudit: 'June 2024',
      auditor: 'PwC South Africa',
      summary: 'Annual audit confirmed 92% of funds went directly to feeding interventions with zero material findings.'
    },
    weeklyHighlights: [
      {
        title: 'Mpumalanga drought relief',
        description: '4 mobile kitchens deployed to Nkomazi communities, serving 12 400 extra meals.',
        icon: 'mdi-truck-delivery-outline'
      },
      {
        title: 'School breakfast clubs',
        description: '30 schools in Gauteng piloted fortified porridges improving attendance by 8%.',
        icon: 'mdi-school'
      },
      {
        title: 'Community nutrition workshops',
        description: 'Parents in KwaZulu-Natal attended classes on affordable balanced meal planning.',
        icon: 'mdi-food-apple'
      }
    ],
    fieldReports: [
      {
        location: 'Johannesburg, Gauteng',
        mealsServed: 42000,
        shortagesAddressed: 'Fresh produce and protein packs replenished for 14 centres.',
        childrenImpacted: 15800
      },
      {
        location: 'Durban, KwaZulu-Natal',
        mealsServed: 38500,
        shortagesAddressed: 'Repaired flood-damaged pantry spaces and rerouted deliveries.',
        childrenImpacted: 14200
      },
      {
        location: 'Cape Town, Western Cape',
        mealsServed: 33320,
        shortagesAddressed: 'Partner kitchens equipped with new refrigeration to cut waste.',
        childrenImpacted: 12850
      }
    ],
    engagementLog: []
  }),
  getters: {
    totalMealsServed(state) {
      return state.fieldReports.reduce((total, report) => total + report.mealsServed, 0)
    }
  },
  actions: {
    recordEngagement(type, meta = {}) {
      this.engagementLog.push({
        type,
        meta,
        at: new Date().toISOString()
      })
    }
  }
})
