<script>
import TopBarMenu from "~/components/dashboard/navBar.vue";
import DonationModal from "~/components/DonationModal.vue";
import { usePartnerOnboardingStore } from "~/stores/partnerOnboarding.js";

export default {
  name: "PartnersPage",
  components: { TopBarMenu, DonationModal },
  data() {
    return {
      onboardingStore: usePartnerOnboardingStore(),
      formValid: false,
      submitting: false,
      applicationSubmitted: false,
      showDonationPrompt: false,
      partnerForm: {
        companyName: "",
        contactPerson: "",
        email: "",
        audience: "",
        campaignIdea: "",
        socialHandle: "",
        couponPlan: "",
        hasDonated: null,
        contributionEvidence: null,
        agreeToShare: false,
      },
    };
  },
  computed: {
    hero() {
      return this.onboardingStore.hero;
    },
    benefits() {
      return this.onboardingStore.benefits;
    },
    impactHighlights() {
      return this.onboardingStore.impactHighlights;
    },
    successStories() {
      return this.onboardingStore.successStories;
    },
    shareIdeas() {
      return this.onboardingStore.shareIdeas;
    },
    donationPrompt() {
      return this.onboardingStore.donationPrompt;
    },
  },
  methods: {
    openApplicationForm() {
      this.scrollTo("#partner-application");
    },
    async submitPartnerApplication() {
      const form = this.$refs.partnerFormRef;
      if (!form) {
        return;
      }
      const valid = await form.validate();
      if (!valid) {
        return;
      }
      this.submitting = true;
      try {
        this.onboardingStore.submitApplication(this.partnerForm);
        this.applicationSubmitted = true;
        this.showDonationPrompt = true;
        this.partnerForm = {
          companyName: "",
          contactPerson: "",
          email: "",
          audience: "",
          campaignIdea: "",
          socialHandle: "",
          couponPlan: "",
          agreeToShare: false,
        };
        if (this.$refs.partnerFormRef) {
          this.$refs.partnerFormRef.resetValidation();
        }
      } finally {
        this.submitting = false;
      }
    },
    donateNow() {
      window.open("https://pos.snapscan.io/qr/PXMP40263", "_blank");
    },
    scrollTo(selector) {
      if (process.client) {
        const target = document.querySelector(selector);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
  },
};
</script>

<template>
  <v-container class="pa-0 partners-page mb-10" fluid>
    <TopBarMenu />

    <v-sheet class="hero" rounded="0" dark>
      <v-container class="ma-10">
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="7">
            <h1 class="text-h3 font-weight-bold mb-4">{{ hero.title }}</h1>
            <p class="text-body-1 mb-6">{{ hero.subtitle }}</p>
            <v-btn
              color="white"
              class="red--text text--darken-2"
              size="large"
              @click="openApplicationForm"
            >
              Apply to partner
            </v-btn>
          </v-col>
          <v-col cols="12" md="5">
            <v-row>
              <v-col
                v-for="highlight in impactHighlights"
                :key="highlight.label"
                cols="12"
              >
                <v-sheet
                  class="py-4 px-5 mb-3"
                  color="white"
                  rounded
                >
                  <div class="text-h5 font-weight-bold">
                    {{ highlight.value }}
                  </div>
                  <div class="text-caption text-uppercase">
                    {{ highlight.label }}
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-container class="py-10">
      <v-row class="mb-8">
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold text-center mb-6">
            Why brands love partnering with AddHope
          </h2>
        </v-col>
        <v-col
          v-for="benefit in benefits"
          :key="benefit.title"
          cols="12"
          md="4"
        >
          <v-card elevation="6" class="pa-6 text-left benefit-card">
            <v-icon size="36" color="error" class="mb-3">{{
              benefit.icon
            }}</v-icon>
            <div class="text-h6 font-weight-medium mb-2">
              {{ benefit.title }}
            </div>
            <p class="text-body-2 mb-0">{{ benefit.description }}</p>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-10" align="stretch">
        <v-col cols="12" md="7">
          <v-card elevation="6" class="pa-6 fill-height">
            <v-card-title class="text-h6 font-weight-bold"
              >Proven impact</v-card-title
            >
            <v-card-text>
              <v-timeline density="compact" truncate-line="both">
                <v-timeline-item
                  v-for="story in successStories"
                  :key="story.headline"
                  color="error"
                  size="small"
                >
                  <template #opposite>
                    <strong>{{ story.headline }}</strong>
                  </template>
                  <div class="text-body-2">{{ story.detail }}</div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card elevation="6" class="pa-6 fill-height" color="#fff5f5">
            <v-card-title class="text-h6 font-weight-bold"
              >Amplify your listing</v-card-title
            >
            <v-card-text>
              <p class="text-body-2">
                Once approved, your business will feature on our partner
                showcase with direct links for customers to shop or redeem
                coupon codes. Share your AddHope listing and invite your
                audience to support nutritious meals.
              </p>
              <v-divider class="my-4"></v-divider>
              <v-list density="comfortable">
                <v-list-item v-for="idea in shareIdeas" :key="idea.title">
                  <template #prepend>
                    <v-icon color="error">{{ idea.icon }}</v-icon>
                  </template>
                  <v-list-item-title>{{ idea.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    idea.description
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-10">
        <v-col cols="12">
          <v-card elevation="8" class="pa-8" id="partner-application">
            <v-card-title class="text-h5 font-weight-bold"
              >Apply to become a featured partner</v-card-title
            >
            <v-card-subtitle class="mb-6">
              Share your vision, we will help you convert customer love into
              lasting nourishment.
            </v-card-subtitle>
            <v-form ref="partnerFormRef" v-model="formValid">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="partnerForm.companyName"
                    label="Company or brand name"
                    :rules="[(v) => !!v || 'Company name is required']"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="partnerForm.contactPerson"
                    label="Primary contact"
                    :rules="[(v) => !!v || 'Primary contact is required']"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="partnerForm.email"
                    label="Email address"
                    type="email"
                    :rules="[
                      (v) => !!v || 'Email is required',
                      (v) => /.+@.+/.test(v) || 'Enter a valid email',
                    ]"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="partnerForm.socialHandle"
                    label="Website or social handle"
                    variant="outlined"
                    hint="Optional"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="partnerForm.audience"
                    label="Tell us about your audience"
                    :rules="[(v) => !!v || 'Please describe your audience']"
                    auto-grow
                    rows="3"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="partnerForm.campaignIdea"
                    label="Describe the impact you aim to create"
                    :rules="[(v) => !!v || 'We would love to hear your idea']"
                    auto-grow
                    rows="4"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="partnerForm.hasDonated"
                    :items="[
                      { title: 'Yes', value: true },
                      { title: 'No', value: false },
                    ]"
                    label="Are you an existing AddHope partner?"
                    :rules="[
                      (v) =>
                        (v !== null && v !== undefined) ||
                        'Please select an option',
                    ]"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col v-if="partnerForm.hasDonated === true" cols="12" md="6">
                  <v-file-input
                    v-model="partnerForm.contributionEvidence"
                    label="Upload contribution evidence"
                    :rules="[
                      (v) => !!v || 'Please upload evidence of your donation',
                    ]"
                    accept="image/*,.pdf,.doc,.docx"
                    prepend-icon=""
                    prepend-inner-icon="mdi-paperclip"
                    required
                    variant="outlined"
                    hint="Upload receipt, proof of payment, or donation confirmation (PDF, Image, or Document)"
                    persistent-hint
                    show-size
                  ></v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    v-model="partnerForm.agreeToShare"
                    :rules="[
                      (v) =>
                        !!v ||
                        'Please confirm you are ready to share your listing',
                    ]"
                    label="I am ready to share my AddHope listing and encourage customers to donate."
                    color="error"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-form>
            <v-btn
              color="error"
              class="mt-4"
              :loading="submitting"
              :disabled="submitting"
              @click="submitPartnerApplication"
            >
              Submit application
            </v-btn>
            <v-alert
              v-if="applicationSubmitted"
              type="success"
              class="mt-4"
              border="start"
              variant="tonal"
            >
              Thank you! Our partnerships team will be in touch within 7
              business days with next steps.
            </v-alert>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card elevation="6" class="pa-6 text-center" color="#fef4f5">
            <h3 class="text-h5 font-weight-bold mb-4">
              Create momentum right now
            </h3>
            <p class="text-body-2 mb-6">
              Share your AddHope link on social media and invite your supporters
              to unlock meals immediately.
            </p>
            <DonationModal />
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showDonationPrompt" max-width="480">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">{{
          donationPrompt.title
        }}</v-card-title>
        <v-card-text>
          <p class="text-body-2 mb-4">{{ donationPrompt.message }}</p>
          <p class="text-body-2">
            Use our secure SnapScan link or the Donate button below to keep hope
            growing while we review your application.
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="showDonationPrompt = false"
            >Later</v-btn
          >
          <v-btn color="error" @click="donateNow">Donate now</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.partners-page {
  background: #faf8f7;
}

.hero {
  background: linear-gradient(120deg, #e4002b, #8c1a1a);
  color: white;
  padding-top: 64px;
  padding-bottom: 64px;
}

.benefit-card {
  background: white;
  min-height: 220px;
}

/* Tablet styles */
@media (max-width: 1024px) {
  .responsive-logout-item {
    padding: 6px 12px;
  }
  .hero {
    background: linear-gradient(120deg, #e4002b, #8c1a1a);
    color: white;
    padding-top: 10%;
    padding-bottom: 64px;
  }

  .logout-icon {
    font-size: 22px;
  }

  .logout-title {
    font-size: 0.9rem;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .responsive-logout-item {
    padding: 4px 8px;
    min-height: 44px; /* Better touch targets */
  }

  .hero {
    background: linear-gradient(120deg, #e4002b, #8c1a1a);
    color: white;
    padding-top: 20%;
    padding-bottom: 64px;
  }

  .logout-icon {
    font-size: 20px;
    margin-right: 12px;
  }

  .logout-title {
    font-size: 0.85rem;
    font-weight: 400;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .responsive-logout-item {
    padding: 6px 12px;
  }

  .hero {
    background: linear-gradient(120deg, #e4002b, #8c1a1a);
    color: white;
    padding-top: 20%;
    padding-bottom: 64px;
  }

  .logout-icon {
    font-size: 18px;
    margin-right: 8px;
  }

  .logout-title {
    font-size: 0.8rem;
  }
}

/* Large desktop styles */
@media (min-width: 1740px) {
  .responsive-logout-item {
    padding: 12px 20px;
  }

  .hero {
    background: linear-gradient(120deg, #e4002b, #8c1a1a);
    color: white;
    padding-top: 40%;
    /* padding-bottom: 64px; */
  }

  .logout-icon {
    font-size: 28px;
  }

  .logout-title {
    font-size: 1.1rem;
  }
}
</style>
