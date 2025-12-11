import { defineStore } from 'pinia'

const destinationTemplate = () => ({
    id: `dest-${Math.random().toString(36).substring(2, 9)}`,
    address: '',
    meals: 0,
    duration: 1,
})

const formatDate = (date) => {
    if (!date) {
        return ''
    }
    const instance = new Date(date)
    return instance.toLocaleDateString()
}

export const usePlanStore = defineStore('plan', {
    state: () => ({
        loading: false,
        trips: [],
        draftTrip: {
            name: '',
            startDate: '',
            endDate: '',
            notes: '',
            destinations: [destinationTemplate()],
        },
        latestPlanReport: null,
        suppliers: [],
        mealSuggestions: [],
        optimisationSummary: '',
        centreInsights: [],
        milestones: [],
    }),
    getters: {
        upcomingTrips: (state) => state.trips.filter((trip) => new Date(trip.startDate) >= new Date()),
        pastTrips: (state) => state.trips.filter((trip) => new Date(trip.startDate) < new Date()),
        destinationCount: (state) => state.draftTrip.destinations.length,
        canAddDestination: (state) => state.draftTrip.destinations.length < 10,
        summaryStats: (state) => {
            const totals = state.trips.reduce((accumulator, trip) => {
                const meals = trip.destinations.reduce((sum, destination) => sum + (destination.meals || 0), 0)
                accumulator.meals += meals
                accumulator.destinations += trip.destinations.length
                return accumulator
            }, { meals: 0, destinations: 0 })
            return {
                trips: state.trips.length,
                meals: totals.meals,
                destinations: totals.destinations,
            }
        },
    },
    actions: {
        initialise(centerName) {
            if (this.trips.length) {
                return
            }

            const baseDate = new Date()
            const format = (offset) => {
                const date = new Date(baseDate)
                date.setDate(date.getDate() + offset)
                return date.toISOString().split('T')[0]
            }

            this.trips = [
                {
                    id: 'trip-1',
                    center: centerName,
                    name: 'Southern Peninsula Relief',
                    startDate: format(2),
                    endDate: format(4),
                    status: 'In Progress',
                    notes: 'Focus on settlements impacted by recent storms.',
                    destinations: [
                        { address: 'Masiphumelele community hall', meals: 320, duration: 2 },
                        { address: 'Ocean View sports centre', meals: 210, duration: 1 },
                    ],
                },
                {
                    id: 'trip-2',
                    center: centerName,
                    name: 'Cape Flats Nutrition Boost',
                    startDate: format(-5),
                    endDate: format(-3),
                    status: 'Completed',
                    notes: 'Partnered with local churches for distribution.',
                    destinations: [
                        { address: 'Khayelitsha Site C clinic', meals: 400, duration: 2 },
                        { address: 'Philippi education hub', meals: 250, duration: 1 },
                        { address: 'Mitchells Plain community centre', meals: 300, duration: 2 },
                    ],
                },
            ]
            this.generateSuppliers()
            this.generateMealSuggestions()
            if (this.trips.length) {
                this.generateOptimisationSummary(this.trips[0])
            }
            this.generateCentreInsights(centerName)
            this.generateMilestones()
        },
        addDestination() {
            if (!this.canAddDestination) {
                return
            }
            this.draftTrip.destinations.push(destinationTemplate())
        },
        removeDestination(index) {
            if (this.draftTrip.destinations.length === 1) {
                return
            }
            this.draftTrip.destinations.splice(index, 1)
        },
        resetDraft() {
            this.draftTrip = {
                name: '',
                startDate: '',
                endDate: '',
                notes: '',
                destinations: [destinationTemplate()],
            }
        },
        json_formater(data){
            let payload = data?.output ?? data

// If the model wrapped the JSON in ```json ... ``` remove it
            if (typeof payload === "string") {
                payload = payload.replace(/```json\s*/g, "").replace(/```/g, "").trim();

                try {
                    payload = JSON.parse(payload);
                } catch (e) {
                    console.error("❌ JSON parse failed:", e, payload);
                    throw new Error("Hotspot service returned invalid JSON");
                }
            }

// Sometimes model nests in { result: "...json..." }
            if (payload?.result && typeof payload.result === "string") {
                try {
                    payload = JSON.parse(payload.result);
                } catch (e) {
                    console.error("❌ Nested JSON parse failed:", e, payload.result);
                }
            } else if (payload?.result && typeof payload.result === "object") {
                payload = payload.result;
            }
            return payload;
        },
        async submitTrip(centerName) {
            if (!this.draftTrip.name || !this.draftTrip.startDate || !this.draftTrip.endDate) {
                throw new Error('Please complete the core trip details before submitting.')
            }

            this.loading = true
            const newTrip = {
                id: `trip-${Date.now()}`,
                center: centerName,
                ...this.draftTrip,
                status: 'Planned',
                createdAt: new Date().toISOString(),
            }
            const data = await this.callEdgeFunction(newTrip);
            const payload = this.json_formater(data);
            if (payload) {
                this.latestPlanReport = payload;
                newTrip.aiReport = payload;
                if (Array.isArray(payload.input_geocoded) && payload.input_geocoded.length) {
                    newTrip.destinations = payload.input_geocoded.map((destination) => ({
                        address: destination.address || '',
                        meals: destination.meals_planned ?? destination.meals_requested ?? 0,
                        duration: destination.duration_days ?? 1,
                    }));
                }
            }
            this.trips.unshift(newTrip)
            this.resetDraft()
            this.loading = false
            this.generateOptimisationSummary(newTrip)
            return newTrip
        },
        generateOptimisationSummary(trip) {
            const summary = this.latestPlanReport?.summary
            if (summary) {
                const totalDestinations = summary.total_destinations ?? trip.destinations.length
                const totalMeals = typeof summary.total_meals_planned === 'number'
                    ? summary.total_meals_planned.toLocaleString()
                    : summary.total_meals_planned || 'N/A'
                const dateWindow = [formatDate(trip.startDate), formatDate(trip.endDate)]
                    .filter(Boolean)
                    .join(' → ')
                const recommendation = summary.recommendation
                    ? ` Recommendation: ${summary.recommendation}`
                    : ''
                this.optimisationSummary = `AI plan ready for ${totalDestinations} destinations covering ${totalMeals} meals.${dateWindow ? ` Deliveries scheduled ${dateWindow}.` : ''}${recommendation}`
                return
            }

            const destinationSummary = trip.destinations
                .map((dest) => `${dest.address} (${dest.meals} meals)`).join(', ')
            this.optimisationSummary = `Optimised routes created for ${trip.destinations.length} destinations: ${destinationSummary}. Logistics will stagger deliveries between ${formatDate(trip.startDate)} and ${formatDate(trip.endDate)}.`
        },
        generateSuppliers() {
            this.suppliers = [
                { name: 'Ubuntu Foods Cooperative', specialty: 'Staple ingredients', distance: '12km', priceIndex: 'Low' },
                { name: 'Harvest Fresh Market', specialty: 'Fresh produce & vegetables', distance: '8km', priceIndex: 'Moderate' },
                { name: 'Protea Protein Suppliers', specialty: 'Beans, lentils & canned fish', distance: '15km', priceIndex: 'Low' },
            ]
        },
        generateMealSuggestions() {
            this.mealSuggestions = [
                { name: 'Maize & Bean Stew', nutritionalFocus: 'High fibre, plant protein', costPerChild: 'R8.10' },
                { name: 'Chicken & Veggie Pot', nutritionalFocus: 'Lean protein, seasonal greens', costPerChild: 'R11.40' },
                { name: 'Samp with Butternut', nutritionalFocus: 'Wholesome starch & vitamin A', costPerChild: 'R7.20' },
            ]
        },
        generateCentreInsights(centerName) {
            this.centreInsights = [
                {
                    id: 'insight-1',
                    title: 'Logistics outlook',
                    description: `${centerName} centre can cover 5.2 days of staple meals with current stock.`,
                    icon: 'mdi-truck-cargo-container',
                },
                {
                    id: 'insight-2',
                    title: 'Volunteer availability',
                    description: 'Eighteen trained volunteers confirmed for the next double-shift deliveries.',
                    icon: 'mdi-account-hard-hat',
                },
                {
                    id: 'insight-3',
                    title: 'Community engagement',
                    description: 'Partner NGOs requested nutrition demos alongside meal distribution on Thursday.',
                    icon: 'mdi-hand-heart',
                },
            ]
        },
        async  callEdgeFunction(tripJson) {
            try {
                const config = useRuntimeConfig();
                const url = "https://vxrgduovgddcbggxqywu.supabase.co/functions/v1/llm-chat";

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${config.public.SUPABASE_KEY
                        }` ,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        role_content:  `
You are a logistics and nutrition planning assistant for South African NGO food distribution.

RESPONSE RULES:
- OUTPUT: JSON ONLY. No prose, no markdown, no comments.
- Shape MUST follow the “Output Schema” below exactly.
- If any field from the input is missing or meals are 0, set meals_planned = 1000 (default_meals_when_missing).
- Geocode addresses to {lat,lng} (approximate if needed). Always include coordinates.
- Split routes by region/province when distances are extreme; assume multiple vans if user notes mention more than one vehicle.
- Prefer EXTRA-CHEAP BULK suppliers: “Cash & Carry”, municipal “Fresh Produce Market”, wholesale depots. Rank by lowest price index then distance.
- Keep costs realistic for bulk staples in SA context.
- Meal recommendations must be simple, child-appropriate, and use common SA staples.
- Never invent private data; use generic, plausible public entities when unsure.
- If something cannot be determined, still return valid JSON with best-effort estimates and note assumptions.

CONSTANTS:
- default_meals_when_missing = 1000

OUTPUT SCHEMA (return this shape):
{
  "generated_at": "ISO-8601 string",
  "trip_name": "string",
  "center": "string",
  "assumptions": {
    "default_meals_when_missing": 1000,
    "cost_basis_meal_plan": "string"
  },
  "input_geocoded": [
    {
      "id": "string",
      "address": "string",
      "lat": -00.0000,
      "lng": 00.0000,
      "meals_requested": number,
      "meals_planned": number,
      "duration_days": number
    }
  ],
  "route_plan": [
    {
      "vehicle": "string",
      "region": "string",
      "optimized_path": [
        {
          "stop": "string",
          "lat": -00.0000,
          "lng": 00.0000,
          "eta": "HH:MM",
          "meals_delivered": number
        }
      ],
      "total_distance_km": number,
      "total_drive_time_h": number,
      "notes": "string"
    }
  ],
  "bulk_suppliers": [
    {
      "for_region": "string",
      "near": "string",
      "options": [
        {
          "name": "string",
          "type": "Cash & Carry | Fresh Produce Market | Wholesale / Hyper",
          "lat": -00.0000,
          "lng": 00.0000,
          "distance_km": number,
          "price_index": "Very Low | Low | Medium",
          "recommended_bulk_items": ["string"],
          "notes": "string"
        }
      ]
    }
  ],
  "meal_recommendations": [
    {
      "name": "string",
      "region_fit": "string",
      "avg_cost_per_child": number,
      "macro_profile": "string",
      "ingredients": ["string"],
      "allergy_notice": "string"
    }
  ],
  "summary": {
    "total_destinations": number,
    "total_meals_planned": number,
    "estimated_food_cost_R": number,
    "recommendation": "string"
  },
  "methodology": {
    "geocode": "string",
    "routing": "string",
    "supplier_selection": "string",
    "meals": "string"
  }
}
`,
                         user_content : `
Given this trip plan JSON, produce the AI output strictly following the schema:

${JSON.stringify(tripJson, null, 2)}
`.trim()

                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const hope = await response.json();

                return hope;
            } catch (err) {
                console.error("❌ Error calling Supabase function:", err);
            }
        },
        generateMilestones() {
            const today = new Date()
            const addDays = (value) => {
                const copy = new Date(today)
                copy.setDate(copy.getDate() + value)
                return copy
            }
            this.milestones = [
                {
                    id: 'milestone-1',
                    status: 'Scheduled',
                    name: 'Fleet inspection',
                    description: 'Confirm readiness of refrigerated vans before Saturday run.',
                    date: formatDate(addDays(0)),
                },
                {
                    id: 'milestone-2',
                    status: 'In Progress',
                    name: 'Cold chain audit',
                    description: 'Auditing storage temperatures across Gauteng partners.',
                    date: formatDate(addDays(2)),
                },
                {
                    id: 'milestone-3',
                    status: 'Completed',
                    name: 'Driver refresher training',
                    description: 'Six drivers completed updated safety protocols earlier this week.',
                    date: formatDate(addDays(-3)),
                },
            ]
        },
    },
})
