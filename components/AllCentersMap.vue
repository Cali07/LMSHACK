<template>
  <div class="map-container">
    <iframe
        src="https://sc-addhope-public.s3.af-south-1.amazonaws.com/marketing/04-08-2021/map.html"
        width="100%"
        height="100%"
        title="KFC Add Hope Map"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "AddHopeMap",
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 80vh; /* adjust as needed */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
</style>
