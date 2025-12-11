<template>
  <v-data-table
      :headers="headers"
      :items="centers"
      class="elevation-1"
  ></v-data-table>
</template>

<script>
export default {
  name: 'ComparisonTable',
  props: {
    centers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'Center', value: 'center' },
        { text: 'Meals Served', value: 'meals' },
        { text: 'Kids Fed', value: 'kids' },
        { text: 'Shortages', value: 'shortages' },
      ]
    }
  }
}
</script>
