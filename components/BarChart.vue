<template>
  <div class="bar-chart">
    <ApexChart
      type="bar"
      :height="320"
      :options="chartOptions"
      :series="seriesData"
    />
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'BarChart',
  components: { ApexChart: VueApexCharts },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const normalizedData = computed(() =>
      Array.isArray(props.data) ? props.data : []
    )

    const categories = computed(() =>
      normalizedData.value.map(item => item?.date ?? '')
    )

    const seriesData = computed(() => [
      {
        name: 'Meals',
        data: normalizedData.value.map(item => item?.meals ?? 0),
      },
      {
        name: 'Donations',
        data: normalizedData.value.map(item => item?.donations ?? 0),
      },
    ])

    const chartOptions = computed(() => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        animations: { enabled: true },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
          borderRadius: 6,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: categories.value,
        labels: {
          style: {
            colors: '#5C5C5C',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#5C5C5C',
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
      fill: {
        opacity: 1,
      },
      colors: ['#E4002B', '#4CAF50'],
      tooltip: {
        y: {
          formatter: value => `${value}`,
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '60%',
              },
            },
          },
        },
      ],
    }))

    return {
      chartOptions,
      seriesData,
    }
  },
})
</script>

<style scoped>
.bar-chart {
  width: 100%;
}
</style>
