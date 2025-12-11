<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ props }">
      <v-btn color="success" v-bind="props">Donate to Support Meals</v-btn>
    </template>

    <v-card>
      <v-card-title>Support AddHope</v-card-title>
      <v-card-text>
        <p>Would you like to donate to help feed children? Your R2 changes lives</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="donate">Donate</v-btn>
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'DonationModal',
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    donate() {
      window.open('https://pos.snapscan.io/qr/PXMP40263', '_blank')
      this.dialog = false
    }
  }
}
</script>
