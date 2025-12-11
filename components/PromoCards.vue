<template>
  <v-card class="ma-3 pa-3" max-width="300">
    <v-img :src="partner.logo" height="150px" class="mb-3"></v-img>
    <v-card-title>{{ partner.name }}</v-card-title>
    <v-card-subtitle>{{ partner.description }}</v-card-subtitle>
    <v-card-actions>
      <v-btn color="primary" @click="openDialog">Claim Code</v-btn>
    </v-card-actions>

    <!-- Donation Popup -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>Support AddHope</v-card-title>
        <v-card-text>
          <p>Would you like to donate R2 to help feed children? 💙
            Your support makes a real difference.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="donateAndShowCode">Yes, Donate</v-btn>
          <v-btn color="primary" @click="justShowCode">No, Thanks</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { usePartnerStore } from '~/stores/partners.js'

export default {
  name: 'DiscountCard',
  props: {
    partner: { type: Object, required: true }
  },
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    openDialog() {
      this.dialog = true
    },
    donateAndShowCode() {
      window.open('https://pos.snapscan.io/qr/PXMP40263', '_blank')
      this.showCode()
    },
    justShowCode() {
      this.showCode()
    },
    showCode() {
      const partnerStore = usePartnerStore()
      partnerStore.claimCode(this.partner.id)
      alert(`🎉 Your discount code is: ${this.partner.code}`)
      this.dialog = false
    }
  }
}
</script>
