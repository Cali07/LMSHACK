// stores/hotspots.js
import { defineStore } from 'pinia'


function normalizeItem(item) {
    return {
        id: `${item.name}-${item.rank}`,
        name: item.name,
        province: item.province || "",
        adminLevel: item.admin_level || "",
        lat: item.coordinates?.lat,
        lng: item.coordinates?.lng,
        band: item.severity?.band || "Medium",
        score: item.severity?.score ?? 50,
        reasons: item.reasons || [],
        metrics: item.metrics || {},
        sources: item.sources || [],
        rank: item.rank
    }
}

export const useHotspotsStore = defineStore('hotspots', {
    state: () => ({
        items: [],
        provinces : [
            "Eastern Cape",
            "Free State",
            "Gauteng",
            "KwaZulu-Natal",
            "Limpopo",
            "Mpumalanga",
            "Northern Cape",
            "North West",
            "Western Cape"
        ],
        lastUpdated: null,
        loading: false,
        error: null
    }),

    getters: {
        topCritical(state) {
            return state.items.filter(i => i.band === 'Critical').slice(0, 10)
        },
        sorted(state) {
            return [...state.items].sort((a, b) => a.rank - b.rank)
        }
    },

    actions: {

        async loadHotspotsDefault(){
            const { $supabase } = useNuxtApp()

            let { data, error } = await $supabase
                .from('Hotspots')
                .select('hotspots')
                .eq('id', 1)
                .single();
            this.lastUpdated = data.hotspots.generated_at
            this.items = (data.hotspots.hotspots || []).map(normalizeItem)

            if (error) {
                console.error(error);
            } else {
                console.log(data);
            }
        },



        async fetchHotspots(province) {
            const today = new Date().toISOString().split('T')[0]

            this.loading = true
            this.error = null

            try {
const data =  await this.callEdgeFunction(today,province)

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


                if (!payload) {
                    throw new Error('No data returned from hotspot service')
                }


                const hotspots = payload?.hotspots || []

                if (!Array.isArray(hotspots) || !hotspots.length) {
                    throw new Error('No hotspots returned')
                }

                this.items = hotspots.map(normalizeItem)
                this.lastUpdated = payload.generated_at || new Date().toISOString()
                this.error = null

                return this.items
            } catch (err) {
                console.error('Supabase function error:', err)
                const baseMessage = err?.message || 'Unable to fetch hotspots'
                this.error = `${baseMessage} — showing saved hotspot data.`

                if (!this.items.length) {
                    await this.loadHotspotsDefault();
                }

                return null
            } finally {
                this.loading = false
            }
        },


        async  callEdgeFunction(today,province) {
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
                        role_content: `
        You are a data synthesis assistant.

        REQUIREMENTS:
        - OUTPUT: JSON ONLY (no prose).
        - Return object with keys: generated_at, country, hotspots[], methodology.
        - hotspots[] must have EXACTLY these keys:
          rank (int 1..10),
          name (string),
          admin_level ("city" or "town"),
          province (string),
          coordinates {lat: number, lng: number},
          severity {band: "Critical"|"High"|"Medium"|"Low", score: int 0..100},
          reasons [string, ...] (3–5 concise drivers),
          metrics {
            shortage_days_7d: int,
            meals_per_child_z: number,
            staple_price_z: number,
            fuel_price_pct30d: number,
            spi30: number,
            ndvi_anom: number,
            attendance_pct14d: number,
            sam_cases_per_10k: number
          },
          sources [{title: string, url: string}, ...] with 2–3 credible SA or global sources (e.g., Stats SA, SA Weather Service, FAO GIEWS, DBE NSNP). URLs must be public.
        - Coordinates must be accurate for the named city/town (WGS84 lat/lng).
        - Severity score = weighted composite of metrics; be reasonable and avoid extremes.
        - No private data. No PII. No unverifiable claims.

        SCHEMA EXAMPLE (FORMAT ONLY):
        {
          "generated_at": "ISO-8601",
          "country": "South Africa",
          "hotspots": [
            {
              "rank": 1,
              "name": "City Name",
              "admin_level": "city",
              "province": "Province",
              "coordinates": { "lat": -00.0000, "lng": 00.0000 },
              "severity": { "band": "Critical", "score": 85 },
              "reasons": ["reason 1", "reason 2", "reason 3"],
              "metrics": {
                "shortage_days_7d": 2,
                "meals_per_child_z": -1.1,
                "staple_price_z": 1.8,
                "fuel_price_pct30d": 4.2,
                "spi30": -0.9,
                "ndvi_anom": -0.07,
                "attendance_pct14d": -3.1,
                "sam_cases_per_10k": 1.4
              },
              "sources": [
                {"title": "Stats SA CPI", "url": "https://www.statssa.gov.za/"},
                {"title": "SA Weather Service rainfall", "url": "https://www.weathersa.co.za/"}
              ]
            }
          ],
          "methodology": {
            "scoring": "0-100 weighted composite of shortages, prices, fuel, rainfall (SPI), vegetation anomaly (NDVI), attendance, and supply latency",
            "notes": "calibrated heuristics; no PII"
          }
        }
      `,
                        user_content: province
                            ? `Produce a ranked Top-5 list of ${province} hunger hotspots in South Africa for ${today}.`
                            : `Produce a ranked Top-5 list of city/town hunger hotspots in South Africa for ${today}.`
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
        }


    }
})
