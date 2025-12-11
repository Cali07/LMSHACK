import { defineStore } from 'pinia'

const todayIso = () => new Date().toISOString().split('T')[0]

export const useReportsStore = defineStore('reports', {
    state: () => ({
        loading: false,
        submitting: false,
        reports: [],
        statusFilter: 'All',
        draft: {
            date: todayIso(),
            mealsServed: null,
            childrenFed: null,
            shortages: 'No',
            shortageDetails: '',
            remainingStock: '',
            notes: '',
            attachments: [],
        },
        analytics: {
            mealsTrend: [],
            statusBreakdown: [],
            recommendations: [],
        },
        lastSubmitted: null,
    }),
    getters: {
        filteredReports(state) {
            if (state.statusFilter === 'All') {
                return state.reports
            }
            return state.reports.filter((report) => report.status === state.statusFilter)
        },
        hasSubmittedToday(state) {
            return state.reports.some((report) => report.date === state.draft.date)
        },
        totalMealsThisMonth(state) {
            return state.reports.reduce((total, report) => total + (report.mealsServed || 0), 0)
        },
        verificationRate(state) {
            if (!state.reports.length) {
                return 0
            }
            const verified = state.reports.filter((report) => report.status === 'Verified').length
            return Math.round((verified / state.reports.length) * 100)
        },
        latestReport(state) {
            return state.reports.length ? state.reports[0] : null
        },
        statusSummary(state) {
            return state.reports.reduce((accumulator, report) => {
                accumulator[report.status] = (accumulator[report.status] || 0) + 1
                return accumulator
            }, {})
        },
    },
    actions: {
        initialise(centerName) {
            if (this.reports.length) {
                return
            }

            this.reports = [
                {
                    id: 'report-1',
                    date: todayIso(),
                    center: centerName,
                    mealsServed: 420,
                    childrenFed: 360,
                    shortages: 'No',
                    shortageDetails: '',
                    remainingStock: 'Maize (2 days), beans (3 days)',
                    notes: 'Celebrated a community garden harvest with volunteers.',
                    status: 'Verified',
                    attachments: ['photo_20240219.jpg'],
                },
                {
                    id: 'report-2',
                    date: '2024-02-18',
                    center: centerName,
                    mealsServed: 395,
                    childrenFed: 340,
                    shortages: 'Yes',
                    shortageDetails: 'Cooking oil reserves running low. Requesting top-up.',
                    remainingStock: 'Rice (1 day), veggies (2 days)',
                    notes: 'Partnered with local school for distribution.',
                    status: 'Submitted',
                    attachments: ['video_20240218.mp4'],
                },
            ]
            this.lastSubmitted = this.reports[0]
            this.generateAnalytics(centerName)
        },
        setFilter(filter) {
            this.statusFilter = filter
        },
        setDraftField(key, value) {
            this.draft[key] = value
        },
        addAttachments(files) {
            this.draft.attachments = files ? Array.from(files) : []
        },
        resetDraft(centerName) {
            this.draft = {
                date: todayIso(),
                mealsServed: null,
                childrenFed: null,
                shortages: 'No',
                shortageDetails: '',
                remainingStock: '',
                notes: '',
                attachments: [],
                center: centerName,
            }
        },
        async submitReport(centerName) {
            if (this.hasSubmittedToday) {
                throw new Error('A report for today has already been submitted.')
            }
            if (!this.draft.mealsServed || !this.draft.childrenFed || !this.draft.remainingStock) {
                throw new Error('Please complete meals served, children fed, and remaining stock fields.')
            }

            this.submitting = true
            const newReport = {
                id: `report-${Date.now()}`,
                center: centerName,
                ...this.draft,
                status: 'Submitted',
                attachments: (this.draft.attachments || []).map((file) => typeof file === 'string' ? file : file.name),
            }
            this.reports.unshift(newReport)
            this.resetDraft(centerName)
            this.submitting = false
            this.lastSubmitted = newReport
            this.generateAnalytics(centerName)
            return newReport
        },
        generateAnalytics(centerName) {
            const recent = this.reports.slice(0, 7)
            this.analytics.mealsTrend = recent.map((report) => report.mealsServed || 0).reverse()
            const summary = this.statusSummary
            this.analytics.statusBreakdown = [
                { label: 'Verified', value: summary.Verified || 0, color: 'success' },
                { label: 'Submitted', value: summary.Submitted || 0, color: 'primary' },
                { label: 'Flagged', value: summary.Flagged || 0, color: 'warning' },
            ]
            this.analytics.recommendations = [
                {
                    id: 'rec-1',
                    icon: 'mdi-chart-line',
                    title: 'Boost verification speed',
                    description: 'Average verification takes 6h. Share quick tips with data capturers to drop below 4h.',
                },
                {
                    id: 'rec-2',
                    icon: 'mdi-emoticon-happy-outline',
                    title: 'Celebrate community wins',
                    description: `${centerName} submitted 3 stories with strong volunteer engagement this week.`,
                },
                {
                    id: 'rec-3',
                    icon: 'mdi-fruit-watermelon',
                    title: 'Monitor fresh produce',
                    description: 'Two centres flagged low veggies. Coordinate with planning to top up on Thursday.',
                },
            ]
        },
    },
})
