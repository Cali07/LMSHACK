import { defineStore } from 'pinia'

const mockDelay = (duration = 350) => new Promise(resolve => setTimeout(resolve, duration))

export const useAdminStore = defineStore('admin', {
    state: () => ({
        loading: false,
        lastUpdated: null,
        stats: {
            mealsToday: 0,
            kidsToday: 0,
            totalFunds: 0,
            activeShortages: 0,
        },
        weeklyPerformance: [],
        centerComparison: [],
        alerts: [],
        resourceLevels: [],
        impactHighlights: [],
        wellnessScore: 0,
        trendSummaries: {
            week: { label: 'This week', meals: 0, donations: 0, volunteers: 0, onTimeRate: 0 },
            month: { label: 'This month', meals: 0, donations: 0, volunteers: 0, onTimeRate: 0 },
            quarter: { label: 'This quarter', meals: 0, donations: 0, volunteers: 0, onTimeRate: 0 },
        },
        activityFeed: [],
    }),

    getters: {
        hasCriticalShortages: (state) => state.stats.activeShortages > 0,
        totalMealsThisWeek: (state) => state.weeklyPerformance.reduce((total, day) => total + day.meals, 0),
        totalDonationsThisWeek: (state) => state.weeklyPerformance.reduce((total, day) => total + day.donations, 0),
        averageWellnessScore: (state) => state.wellnessScore,
        summaryByRange: (state) => (range) => state.trendSummaries[range] || state.trendSummaries.week,
    },

    actions: {
        async fetchStats() {
            this.loading = true
            await mockDelay()
            this.stats = {
                mealsToday: 1860,
                kidsToday: 940,
                totalFunds: 52300,
                activeShortages: 2,
            }
            this.lastUpdated = new Date().toISOString()
            this.loading = false
        },

        async fetchPerformance() {
            await mockDelay(200)
            const weekly = [
                { date: 'Mon', meals: 220, donations: 320 },
                { date: 'Tue', meals: 280, donations: 410 },
                { date: 'Wed', meals: 340, donations: 460 },
                { date: 'Thu', meals: 310, donations: 430 },
                { date: 'Fri', meals: 365, donations: 520 },
                { date: 'Sat', meals: 295, donations: 380 },
                { date: 'Sun', meals: 260, donations: 340 },
            ]
            this.weeklyPerformance = weekly
            const weeklyMeals = weekly.reduce((total, day) => total + day.meals, 0)
            const weeklyDonations = weekly.reduce((total, day) => total + day.donations, 0)
            this.trendSummaries = {
                week: {
                    label: 'This week',
                    meals: weeklyMeals,
                    donations: weeklyDonations,
                    volunteers: 148,
                    onTimeRate: 94,
                },
                month: {
                    label: 'This month',
                    meals: 7420,
                    donations: 10860,
                    volunteers: 612,
                    onTimeRate: 91,
                },
                quarter: {
                    label: 'This quarter',
                    meals: 21340,
                    donations: 32480,
                    volunteers: 1765,
                    onTimeRate: 89,
                },
            }
        },

        async fetchCenterComparison() {
            await mockDelay(150)
            this.centerComparison = [
                { center: 'Cape Town', meals: 1860, kids: 940, shortages: 1, satisfaction: 92 },
                { center: 'Johannesburg', meals: 2030, kids: 1010, shortages: 1, satisfaction: 88 },
                { center: 'Durban', meals: 1490, kids: 720, shortages: 0, satisfaction: 95 },
                { center: 'Gqeberha', meals: 1210, kids: 630, shortages: 0, satisfaction: 90 },
            ]
        },

        async fetchAlerts() {
            await mockDelay(100)
            this.alerts = [
                { id: 1, type: 'shortage', message: 'Cape Town requires an urgent maize meal delivery by 4pm.' },
                { id: 2, type: 'funds', message: 'Durban relief fund balance dipped below R5 000.' },
                { id: 3, type: 'engagement', message: 'Volunteer turnout in Johannesburg is trending downward for the weekend.' },
            ]
        },

        async fetchResourceLevels() {
            await mockDelay(180)
            this.resourceLevels = [
                { label: 'Staple Foods', value: 76, color: 'primary' },
                { label: 'Fresh Produce', value: 58, color: 'success' },
                { label: 'Proteins', value: 64, color: 'info' },
                { label: 'Fuel & Logistics', value: 42, color: 'warning' },
            ]
        },

        async fetchImpactHighlights() {
            await mockDelay(220)
            this.impactHighlights = [
                {
                    id: 1,
                    title: 'Nutrition Workshops',
                    description: '3 centres hosted food education sessions reaching 120 caregivers this week.',
                    icon: 'mdi-food-apple-outline',
                },
                {
                    id: 2,
                    title: 'Community Kitchens',
                    description: 'Two new community kitchens opened in Gauteng serving 400 additional meals daily.',
                    icon: 'mdi-home-heart',
                },
                {
                    id: 3,
                    title: 'Logistics Optimisation',
                    description: 'Fleet route optimisation reduced transport costs by 12% this month.',
                    icon: 'mdi-truck-fast',
                },
            ]
        },

        async fetchWellnessScore() {
            await mockDelay(120)
            this.wellnessScore = 87
        },

        async fetchActivityFeed() {
            await mockDelay(160)
            this.activityFeed = [
                {
                    id: 'activity-1',
                    title: 'Community nutrition workshop',
                    description: 'Cape Town centre trained 45 caregivers on nutrient-rich meal planning.',
                    icon: 'mdi-school',
                    timestamp: '08:45',
                },
                {
                    id: 'activity-2',
                    title: 'Emergency delivery dispatched',
                    description: 'Johannesburg team routed an express maize delivery to Soweto hub.',
                    icon: 'mdi-truck-delivery',
                    timestamp: '10:20',
                },
                {
                    id: 'activity-3',
                    title: 'Volunteer surge confirmed',
                    description: 'Durban recorded 32 new volunteers for the weekend outreach.',
                    icon: 'mdi-account-group',
                    timestamp: '12:05',
                },
            ]
        },

        async initialiseDashboard() {
            await Promise.all([
                this.fetchStats(),
                this.fetchPerformance(),
                this.fetchCenterComparison(),
                this.fetchAlerts(),
                this.fetchResourceLevels(),
                this.fetchImpactHighlights(),
                this.fetchWellnessScore(),
                this.fetchActivityFeed(),
            ])
        },
    },
})
