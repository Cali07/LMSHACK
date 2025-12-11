<template>
  <div style="height: 100vh; width: 100vw">
    <LMap
      ref="map"
      :zoom="6"
      :max-zoom="22"
      :center="mapCenter"
      :useGlobalLeaflet="true"
      @ready="onMapReady"
      style="height: 50vh; width: 100%"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
    </LMap>
  </div>
</template>
<script>
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useHotspotsStore } from "~/stores/hotspots.js";

export default {
  name: "MapHotspot",
  components: { LMap, LTileLayer },
  data() {
    return {
      map: null,
      markers: [], // keep track of markers so we can clear/refresh
      mapCenter: [-30.5595, 22.9375], // South Africa centroid
    };
  },
  computed: {
    hotspots() {
      const store = useHotspotsStore();
      return store.sorted || [];
    },
  },
  async mounted() {
    const store = useHotspotsStore();
    await store.loadHotspotsDefault();
  },
  watch: {
    hotspots: {
      deep: true,
      handler(newHotspots) {
        if (this.map) {
          this.refreshMarkers(newHotspots);
        }
      },
    },
  },
  methods: {
    severityColor(band) {
      if (band === "Critical") return "#e53935";
      if (band === "High") return "#fb8c00";
      if (band === "Medium") return "#fdd835";
      return "#43a047"; // Low
    },
    circleIcon(h) {
      const color = this.severityColor(h.band);
      return L.divIcon({
        className: "custom-circle",
        html: `<div class="circle" style="background:${color}">${h.score}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    },
    onMapReady(mapInstance) {
      this.map = mapInstance;
      // in case hotspots already loaded
      if (this.hotspots.length) {
        this.refreshMarkers(this.hotspots);
      }
    },
    refreshMarkers(hotspots) {
      // clear old markers
      this.markers.forEach((m) => this.map.removeLayer(m));
      this.markers = [];

      hotspots.forEach((h) => {
        const marker = L.marker([h.lat, h.lng], {
          icon: this.circleIcon(h),
        }).addTo(this.map);

        marker.bindPopup(`
          <div class="popup">
            <div class="title">${h.name} (${h.province})</div>
            <div class="badge" style="background:${this.severityColor(h.band)}">
              ${h.band} · ${h.score}
            </div>
            <ul class="reasons">
              ${h.reasons
                .slice(0, 3)
                .map((r) => `<li>${r}</li>`)
                .join("")}
            </ul>
            <div class="sources">
              ${h.sources
                .map(
                  (s) =>
                    `<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>`
                )
                .join("")}
            </div>
          </div>
        `);

        this.markers.push(marker);
      });
    },
  },
};
</script>

<style scoped>
.custom-circle .circle {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 14px;
  border: 2px solid rgba(0, 0, 0, 0.2);
}
.popup .title {
  font-weight: 700;
  margin-bottom: 4px;
}
.popup .badge {
  display: inline-block;
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  margin: 6px 0;
}
.popup .reasons {
  padding-left: 16px;
  margin: 6px 0;
}
.popup .sources a {
  display: block;
  font-size: 12px;
  color: #1976d2;
}
</style>
