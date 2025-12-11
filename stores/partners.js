import { defineStore } from 'pinia'

export const usePartnerStore = defineStore('partner', {
    state: () => ({
        partners: [
            // Retail
            {
                id: 1,
                name: 'StareMart',
                description: 'Get R50 off family essentials. Every order supports local food drives.',
                code: 'STARE50',
                url: 'https://www.staremart.example',
                logo: 'https://media.istockphoto.com/id/1470359393/vector/simple-modern-minimalist-symbol-of-transformation-transition-logo-of-two-square-connected.jpg?s=612x612&w=0&k=20&c=IeQ6bIBS8yBfbHgB_L4h1r55VL9rvv3gO9oPsnrKO0I=',
                category: 'Retail',
            },
            {
                id: 2,
                name: 'UrbanFresh',
                description: 'Save R30 on healthy meal baskets. Proceeds fund nutrition programs.',
                code: 'URBAN30',
                url: 'https://www.urbanfresh.example',
                logo: 'https://media.istockphoto.com/id/1470359393/vector/simple-modern-minimalist-symbol-of-transformation-transition-logo-of-two-square-connected.jpg?s=612x612&w=0&k=20&c=IeQ6bIBS8yBfbHgB_L4h1r55VL9rvv3gO9oPsnrKO0I=',
                category: 'Retail',
            },

            // Financial
            {
                id: 3,
                name: 'TrustBank',
                description: 'Earn 10% cashback on groceries every Monday. Portion funds school meals.',
                code: 'TRUST10',
                url: 'https://www.trustbank.example',
                logo: 'https://media.istockphoto.com/id/1470359393/vector/simple-modern-minimalist-symbol-of-transformation-transition-logo-of-two-square-connected.jpg?s=612x612&w=0&k=20&c=IeQ6bIBS8yBfbHgB_L4h1r55VL9rvv3gO9oPsnrKO0I=',
                category: 'Financial',
            },
            {
                id: 4,
                name: 'SafeFinance',
                description: 'Open an account and we’ll sponsor 3 meals per month for vulnerable children.',
                code: 'SAFE3',
                url: 'https://www.safefinance.example',
                logo: 'https://media.istockphoto.com/id/1470359393/vector/simple-modern-minimalist-symbol-of-transformation-transition-logo-of-two-square-connected.jpg?s=612x612&w=0&k=20&c=IeQ6bIBS8yBfbHgB_L4h1r55VL9rvv3gO9oPsnrKO0I=',
                category: 'Financial',
            },

            // NGO
            {
                id: 5,
                name: 'Hope4All',
                description: 'Every purchase donates R20 towards hunger relief and education programs.',
                code: 'HOPE20',
                url: 'https://www.hope4all.example',
                logo: 'https://media.istockphoto.com/id/1470359393/vector/simple-modern-minimalist-symbol-of-transformation-transition-logo-of-two-square-connected.jpg?s=612x612&w=0&k=20&c=IeQ6bIBS8yBfbHgB_L4h1r55VL9rvv3gO9oPsnrKO0I=',
                category: 'NGO',
            },
            {
                id: 6,
                name: 'MealsUnited',
                description: 'Partnering to serve 1 million meals annually across Africa.',
                code: 'MEAL100',
                url: 'https://www.mealsunited.example',
                logo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Ffake-logo&psig=AOvVaw2XKBg2EVJN0yWhRTaGijDt&ust=1759662057928000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKjBqpCyipADFQAAAAAdAAAAABAE',
                category: 'NGO',
            },

            // Learning & Development
            {
                id: 7,
                name: 'SkillSpring',
                description: 'Get 50% off courses. Each signup supports free workshops in rural schools.',
                code: 'SKILL50',
                url: 'https://www.skillspring.example',
                logo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Ffake-logo&psig=AOvVaw2XKBg2EVJN0yWhRTaGijDt&ust=1759662057928000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKjBqpCyipADFQAAAAAdAAAAABAE',
                category: 'Learning & Development',
            },
            {
                id: 8,
                name: 'EduBridge',
                description: 'Enroll today and sponsor 2 learners with digital literacy training.',
                code: 'EDU2',
                url: 'https://www.edubridge.example',
                logo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Ffake-logo&psig=AOvVaw2XKBg2EVJN0yWhRTaGijDt&ust=1759662057928000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKjBqpCyipADFQAAAAAdAAAAABAE',
                category: 'Learning & Development',
            },
        ]
,
        claimedCodes: [],
    }),

    actions: {
        async fetchPartners() {
            // Later: Replace with Supabase fetch
            return this.partners
        },

        claimCode(partnerId) {
            const partner = this.partners.find(p => p.id === partnerId)
            if (partner) {
                this.claimedCodes.push({ partnerId, code: partner.code, claimedAt: new Date() })
            }
        },
    },
})
