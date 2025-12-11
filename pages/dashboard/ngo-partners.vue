<script>
import { defineComponent } from "vue";
import TopBarMenu from "~/components/dashboard/navBar.vue";
import { useNgoPartnersStore } from "~/stores/ngoPartners.js";

export default defineComponent({
  name: "NgoPartnersPage",
  components: { TopBarMenu },
  data() {
    return {
      ngoStore: useNgoPartnersStore(),
      email: "",
      emailFeedback: null,
      emailFeedbackColor: "success",
      applicationForm: {
        orgName: "",
        contactName: "",
        email: "",
        website: "",
        beneficiaries: "",
        message: "",
        hasDocuments: false,
      },
      applicationSubmitted: false,
      formValid: false,
      submitting: false,
      showBackToTop: false,
      isDark: false,
      // News & Updates data
      news: [
        {
          id: 1,
          date: "2024-01-15",
          headline: "New Funding Window Opens for Q2 2024",
          excerpt:
            "Applications for the second quarter 2024 funding cycle are now being accepted. Deadline: March 31, 2024.",
          category: "Funding Opportunity",
          readMore: "/funding-q2-2024",
        },
        {
          id: 2,
          date: "2024-01-08",
          headline: "Record R2.3 Million Distributed to Partners",
          excerpt:
            "KFC AddHope distributed a record R2.3 million to 45 partner NGOs in the last quarter, impacting over 15,000 children.",
          category: "Impact Report",
          readMore: "/impact-report-q4-2023",
        },
        {
          id: 3,
          headline: "Partnership Workshop: Maximizing Community Impact",
          excerpt:
            "Join our free online workshop on February 20th to learn best practices for measuring and reporting community impact.",
          date: "2024-01-20",
          category: "Workshop",
          readMore: "/workshop-february",
        },
        {
          id: 4,
          date: "2023-12-10",
          headline: 'New Documentary: "Hope Served Daily"',
          excerpt:
            "Watch our new documentary featuring three partner NGOs making extraordinary impacts in their communities.",
          category: "Media",
          readMore: "/documentary-hope-served",
        },
        {
          id: 5,
          date: "2023-11-28",
          headline: "Enhanced Reporting Portal Launched",
          excerpt:
            "Our new online reporting portal makes it easier for partners to submit impact reports and track funding.",
          category: "Announcement",
          readMore: "/reporting-portal",
        },
        {
          id: 6,
          headline: "2024 Partnership Criteria Updated",
          excerpt:
            "Review the updated partnership criteria and requirements for the 2024 funding cycle.",
          date: "2023-11-15",
          category: "Guidelines",
          readMore: "/updated-criteria-2024",
        },
      ],
    };
  },
  computed: {
    stats() {
      return this.ngoStore.stats;
    },
    videos() {
      return this.ngoStore.spotlightVideos;
    },
    testimonials() {
      return this.ngoStore.testimonials;
    },
    requirements() {
      return this.ngoStore.requirements;
    },
    contact() {
      return this.ngoStore.contact;
    },
    // Format dates for display
    formattedNews() {
      return this.news.map((item) => ({
        ...item,
        formattedDate: this.formatDate(item.date),
      }));
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.showBackToTop = window.scrollY > 600;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    submitEmail() {
      const result = this.ngoStore.subscribeEmail(this.email);
      this.emailFeedback = result.message;
      this.emailFeedbackColor = result.success ? "success" : "warning";
      if (result.success) {
        this.ngoStore.recordEngagement("email-subscription", {
          email: this.email,
        });
        this.email = "";
      }
    },
    async submitApplication() {
      const form = this.$refs.applicationFormRef;
      if (!form) {
        return;
      }
      const valid = await form.validate();
      if (!valid) {
        return;
      }
      this.submitting = true;
      try {
        this.ngoStore.submitApplication(this.applicationForm);
        this.applicationSubmitted = true;
        this.ngoStore.recordEngagement("application-submitted", {
          orgName: this.applicationForm.orgName,
        });
        this.applicationForm = {
          orgName: "",
          contactName: "",
          email: "",
          website: "",
          beneficiaries: "",
          message: "",
          hasDocuments: false,
        };
        if (this.$refs.applicationFormRef) {
          this.$refs.applicationFormRef.resetValidation();
        }
      } finally {
        this.submitting = false;
      }
    },
    testimonialColor(index) {
      const palette = ["#e4002b", "#d32f2f", "#b71c1c"];
      return palette[index % palette.length];
    },
    scrollTo(selector) {
      if (process.client) {
        const target = document.querySelector(selector);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    getCategoryColor(category) {
      const colors = {
        "Funding Opportunity": "#e4002b",
        "Impact Report": "#4caf50",
        Workshop: "#ff9800",
        Media: "#9c27b0",
        Announcement: "#2196f3",
        Guidelines: "#607d8b",
      };
      return colors[category] || "#666";
    },
    readMore(item) {
      // In a real app, this would navigate to the full article
      console.log("Reading more:", item.readMore);
      this.ngoStore.recordEngagement("news-read-more", { articleId: item.id });
      // For demo purposes, show an alert
      alert(
        `This would navigate to: ${item.readMore}\n\n"${item.headline}"\n\n${item.excerpt}`
      );
    },
  },
});
</script>

<template>
  <v-container class="pa-0 ngo-page" fluid>
    <!-- Skip link for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <TopBarMenu />

    <v-sheet class="hero" color="primary" dark rounded="0">
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="6">
            <h1 class="hero-title">
              KFC AddHope: Making a Difference Together
            </h1>
            <p class="hero-subtitle">
              We nourish more than hungry tummies &mdash; we grow dreams. Join
              our circle of trusted NGOs and fuel the future of South
              Africa&apos;s children.
            </p>
            <v-btn
              color="white"

              size="large"
              variant="tonal"
              @click="scrollTo('#application')"
            >
              Apply to partner
            </v-btn>
          </v-col>
          <v-col cols="12" md="5">
            <v-sheet class="stat-highlight" rounded elevation="6">
              <v-icon color="primary" size="40" class="mb-2">{{
                ngoStore.heroStatHighlight?.icon || "mdi-heart"
              }}</v-icon>
              <div class="stat-value">
                {{ ngoStore.heroStatHighlight?.value }}
              </div>
              <div class="stat-label">
                {{ ngoStore.heroStatHighlight?.title }}
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-container id="main-content" class="py-10 main-content">
      <!-- Stats Section -->
      <v-row class="mb-6 stats-row" dense>
        <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
          <v-card
            elevation="4"
            class="stat-card pa-6 text-center"
            color="#fff5f5"
          >
            <div class="stat-icon-wrapper">
              <v-icon size="36" color="error">{{ stat.icon }}</v-icon>
            </div>
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-description">{{ stat.title }}</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Videos & Email -->
      <v-row class="mb-10 content-row" align="stretch">
        <v-col cols="12" md="6">
          <v-card elevation="6" class="feature-card pa-6 fill-height">
            <v-card-title class="card-title">
              Watch our partners in action
            </v-card-title>
            <v-card-text>
              <p class="card-text mb-4">
                Dive into short stories from our community kitchens and youth
                centres showing where every Rand goes.
              </p>
              <v-carousel
                hide-delimiter-background
                height="500"
                class="video-carousel"
              >
                <v-carousel-item v-for="video in videos" :key="video.title">
                  <v-sheet color="transparent" class="h-100 video-wrapper">
                    <div class="video-title mb-3">{{ video.title }}</div>
                    <div class="video-description mb-4">
                      {{ video.description }}
                    </div>
                    <iframe
                      :src="video.url"
                      width="100%"
                      height="85%"
                      :title="video.title"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      loading="lazy"
                      class="video-iframe"
                    ></iframe>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card elevation="6" class="feature-card pa-6 fill-height">
            <v-card-title class="card-title">Stay in the loop</v-card-title>
            <v-card-text>
              <p class="card-text">
                Touch more lives with us by stretching out your hand to join
                ours. Leave your email and we will share upcoming funding
                windows and inspiration from the field.
              </p>
              <v-text-field
                v-model="email"
                label="Email address"
                placeholder="you@organisation.org"
                class="mt-4 email-input"
                type="email"
                density="comfortable"
                variant="outlined"
                @keyup.enter="submitEmail"
              ></v-text-field>
              <v-btn
                color="error"
                class="mt-2 email-btn"
                @click="submitEmail"
                :disabled="!email"
              >
                Join our NGO circle
              </v-btn>
              <v-alert
                v-if="emailFeedback"
                :type="emailFeedbackColor"
                class="mt-4 alert-message"
                border="start"
                variant="tonal"
              >
                {{ emailFeedback }}
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- News & Updates Section -->
      <v-row class="mb-10 news-row">
        <v-col cols="12">
          <v-card elevation="6" class="news-card pa-8">
            <v-card-title class="news-title">
              <v-icon color="primary" class="mr-3"
                >mdi-newspaper-variant-outline</v-icon
              >
              Latest Updates & Opportunities
            </v-card-title>
            <v-card-subtitle class="news-subtitle">
              Stay informed about funding windows, success stories, and
              partnership opportunities
            </v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col
                  v-for="item in formattedNews"
                  :key="item.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <v-card
                    class="news-item-card"
                    elevation="2"
                    @click="readMore(item)"
                    hover
                  >
                    <v-card-text class="pa-4 news-item-content">
                      <div class="news-item-header mb-3">
                        <v-chip
                          size="small"
                          :color="getCategoryColor(item.category)"
                          text-color="white"
                          class="mb-2"
                        >
                          {{ item.category }}
                        </v-chip>
                        <div
                          class="news-date text-caption text-medium-emphasis"
                        >
                          <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                          {{ item.formattedDate }}
                        </div>
                      </div>
                      <div class="news-headline text-h6 font-weight-bold mb-3">
                        {{ item.headline }}
                      </div>
                      <p class="news-excerpt text-body-2 mb-4">
                        {{ item.excerpt }}
                      </p>
                      <v-btn
                        variant="text"
                        color="primary"
                        size="small"
                        class="read-more-btn"
                      >
                        Read More
                        <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Newsletter CTA -->
              <v-alert
                color="primary"
                variant="tonal"
                class="mt-6 newsletter-cta"
                border="start"
              >
                <template #prepend>
                  <v-icon color="primary">mdi-email-newsletter</v-icon>
                </template>
                <div
                  class="d-flex flex-column flex-md-row align-center justify-space-between"
                >
                  <div>
                    <div class="text-h6 font-weight-bold">
                      Never Miss an Update
                    </div>
                    <div class="text-body-2">
                      Get the latest news delivered directly to your inbox
                    </div>
                  </div>
                  <v-btn
                    color="primary"
                    class="mt-3 mt-md-0"
                    @click="scrollTo('.email-input')"
                  >
                    Subscribe Now
                  </v-btn>
                </div>
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Application Section -->
      <div id="application" class="application-anchor"></div>

      <!-- Requirements & Contact -->
      <v-row class="mb-10 content-row">
        <v-col cols="12" md="7">
          <v-card elevation="6" class="feature-card pa-6">
            <v-card-title class="card-title">What we look for</v-card-title>
            <v-card-text>
              <v-expansion-panels
                variant="accordion"
                class="requirements-panels"
              >
                <v-expansion-panel
                  v-for="(requirement, index) in requirements"
                  :key="requirement"
                >
                  <v-expansion-panel-title class="requirement-title">
                    <v-icon color="error" class="mr-3"
                      >mdi-check-circle-outline</v-icon
                    >
                    Requirement {{ index + 1 }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="requirement-text">
                    {{ requirement }}
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <p class="card-text mt-4">
                Please gather the required documents before starting your
                application to make the review process swift and clear.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card elevation="6" class="contact-card pa-6" color="#fff0f0">
            <v-card-title class="contact-title">Need assistance?</v-card-title>
            <v-card-text>
              <v-list density="comfortable" class="contact-list">
                <v-list-item class="contact-item">
                  <template #prepend>
                    <v-icon color="error" class="contact-icon"
                      >mdi-email-outline</v-icon
                    >
                  </template>
                  <v-list-item-title class="contact-link">
                    <a
                      :href="`mailto:${contact.email}`"
                      class="text-decoration-none"
                      >{{ contact.email }}</a
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle class="contact-subtitle"
                    >Send your motivational letter and documents
                    here.</v-list-item-subtitle
                  >
                </v-list-item>
                <v-list-item class="contact-item">
                  <template #prepend>
                    <v-icon color="error" class="contact-icon"
                      >mdi-file-document-outline</v-icon
                    >
                  </template>
                  <v-list-item-title class="contact-link">
                    <a
                      :href="contact.faq"
                      target="_blank"
                      class="text-decoration-none"
                      >Funding FAQ</a
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle class="contact-subtitle"
                    >Understand timelines, eligibility and reporting
                    expectations.</v-list-item-subtitle
                  >
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-10" id="application">
        <v-col cols="12">
          <v-card elevation="8" class="pa-8">
            <v-card-title class="text-h5 font-weight-bold"
              >Submit your partnership application</v-card-title
            >
            <v-card-subtitle class="mb-6">
              Tell us about your organisation and how we can multiply your
              impact.
            </v-card-subtitle>
            <v-form ref="applicationFormRef" v-model="formValid">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="applicationForm.orgName"
                    label="Organisation name"
                    :rules="[(v) => !!v || 'Organisation name is required']"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="applicationForm.contactName"
                    label="Primary contact person"
                    :rules="[(v) => !!v || 'Contact person is required']"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="applicationForm.email"
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
                    v-model="applicationForm.website"
                    label="Website or social link"
                    hint="Optional but recommended"
                    persistent-hint
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="applicationForm.beneficiaries"
                    label="Who do you serve?"
                    :rules="[(v) => !!v || 'Tell us about your beneficiaries']"
                    auto-grow
                    rows="3"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="applicationForm.message"
                    label="How will AddHope funding transform your work?"
                    :rules="[(v) => !!v || 'Share your vision with us']"
                    auto-grow
                    rows="4"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    v-model="applicationForm.hasDocuments"
                    :rules="[
                      (v) =>
                        !!v ||
                        'Please confirm you have the required documents ready',
                    ]"
                    label="I have the required documents ready to submit via email."
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
              @click="submitApplication"
            >
              Send application
            </v-btn>
            <v-alert
              v-if="applicationSubmitted"
              type="success"
              class="mt-4"
              border="start"
              variant="tonal"
            >
              Thank you! Our team will review your submission within 10 business
              days. Please forward your documents to
              <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
              referencing your organisation name.
            </v-alert>
          </v-card>
        </v-col>
      </v-row>
      <!-- Testimonials -->
      <v-row class="testimonials-row">
        <v-col cols="12">
          <v-card elevation="6" class="testimonials-card pa-8" color="#fef4f5">
            <v-card-title class="testimonials-title"
              >Voices from our partners</v-card-title
            >
            <v-row class="mt-6 testimonials-grid" dense>
              <v-col
                v-for="(testimonial, index) in testimonials"
                :key="testimonial.partner"
                cols="12"
                md="4"
              >
                <v-card
                  :style="{ borderTop: `6px solid ${testimonialColor(index)}` }"
                  elevation="3"
                  class="testimonial-card pa-6 h-100"
                >
                  <v-icon color="error" size="32" class="quote-icon"
                    >mdi-format-quote-close</v-icon
                  >
                  <p class="testimonial-text">{{ testimonial.quote }}</p>
                  <div class="testimonial-author">
                    {{ testimonial.partner }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Back to Top Button -->
    <v-btn
      v-if="showBackToTop"
      icon="mdi-arrow-up"
      color="primary"
      class="back-to-top"
      size="x-large"
      @click="scrollToTop"
    />
  </v-container>
</template>

<style scoped>
/* Skip link for accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #e4002b;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  z-index: 1000;
  font-weight: 600;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}

/* Main page styles */
.ngo-page {
  background: #faf8f7;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #e4002b 0%, #b71c1c 50%, #7f0000 100%);
  color: white;
  padding: 100px 0;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  animation: float 8s ease-in-out infinite;
}

.hero::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-20px, -20px) rotate(5deg);
  }
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-weight: 300;
}

.hero-cta {
  border-radius: 12px;
  font-weight: 700;
  text-transform: none;
  box-shadow: 0 8px 24px rgba(228, 0, 43, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(228, 0, 43, 0.4);
}

/* Stat Highlight */
.stat-highlight {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  transform: translateY(-20px);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.stat-highlight::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(
    135deg,
    rgba(228, 0, 43, 0.3),
    rgba(255, 255, 255, 0.5),
    rgba(228, 0, 43, 0.3)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.stat-highlight:hover {
  transform: translateY(-25px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #e4002b;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 600;
}

/* Stats Cards */
.stats-row {
  position: relative;
}

.stat-card {
  background: linear-gradient(145deg, #ffffff 0%, #fff5f5 100%);
  border: 1px solid rgba(228, 0, 43, 0.1);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(228, 0, 43, 0.3),
    transparent
  );
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(228, 0, 43, 0.1) !important;
}

.stat-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #e4002b 0%, #b71c1c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 20px rgba(228, 0, 43, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 30px rgba(228, 0, 43, 0.4);
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #e4002b;
  margin-bottom: 0.5rem;
}

.stat-description {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

/* Feature Cards */
.feature-card {
  background: linear-gradient(
    145deg,
    #ffffff 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out 0.2s both;
  position: relative;
  overflow: hidden;
}



.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(228, 0, 43, 0.3),
    transparent
  );
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(228, 0, 43, 0.1);
}

.card-title {
  font-size: 1.75rem !important;
  font-weight: 800 !important;
  letter-spacing: -0.5px;
  margin-bottom: 1rem;
  background: linear-gradient(
    135deg,
    var(--v-theme-on-background) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--v-theme-on-surface-variant);
}

/* Video Carousel */
.video-carousel {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.video-wrapper {
  padding: 8px;
}

.video-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--v-theme-on-background);
}

.video-description {
  font-size: 0.9rem;
  color: var(--v-theme-on-surface-variant);
  line-height: 1.5;
}

.video-iframe {
  border-radius: 12px;
  border: none;
}

/* Email Section */
.email-input :deep(.v-field) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.email-input :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(228, 0, 43, 0.2);
}

.email-btn {
  border-radius: 12px;
  font-weight: 700;
  text-transform: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(228, 0, 43, 0.25);
}

.email-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(228, 0, 43, 0.4);
}

.alert-message {
  border-radius: 12px;
  border-left: 4px solid;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.4s ease-out;
}

/* News & Updates Section */
.news-row {
  position: relative;
}

.news-card {
  background: linear-gradient(145deg, #ffffff 0%, #fefafa 100%);
  border-radius: 24px;
  border: 1px solid rgba(228, 0, 43, 0.1);
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.news-title {
  font-size: 2rem !important;
  font-weight: 800 !important;
  background: linear-gradient(135deg, #e4002b 0%, #b71c1c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
}

.news-subtitle {
  font-size: 1.1rem !important;
  color: #666;
  text-align: center;
  margin-top: -8px;
}

.news-item-card {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.news-item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(228, 0, 43, 0.15) !important;
  border-color: rgba(228, 0, 43, 0.2);
}

.news-item-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.news-item-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.news-date {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
}

.news-headline {
  font-size: 1.1rem;
  line-height: 1.4;
  color: #2c3e50;
  min-height: 3em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-excerpt {
  color: #666;
  line-height: 1.5;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-btn {
  align-self: flex-start;
  margin-top: auto;
}

.newsletter-cta {
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

/* Requirements */
.requirements-panels :deep(.v-expansion-panel) {
  border-radius: 12px !important;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.5);
}

.requirement-title {
  font-weight: 600;
}

.requirement-text {
  font-size: 0.9rem;
  line-height: 1.6;
}

/* Contact Card */
.contact-card {
  border-radius: 20px;
  background: linear-gradient(145deg, #fff0f0 0%, #ffeaea 100%);
  border: 1px solid rgba(228, 0, 43, 0.1);
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.contact-title {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #e4002b;
}

.contact-list {
  background: transparent;
}

.contact-item {
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: rgba(228, 0, 43, 0.05);
  transform: translateX(4px);
}

.contact-icon {
  margin-right: 12px;
}

.contact-link a {
  color: #e4002b;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link a:hover {
  color: #b71c1c;
  text-decoration: underline;
}

.contact-subtitle {
  font-size: 0.8rem;
  color: #666;
}

/* Testimonials */
.testimonials-card {
  border-radius: 24px;
  background: linear-gradient(145deg, #fef4f5 0%, #ffeaea 100%);
  border: 1px solid rgba(228, 0, 43, 0.1);
  animation: fadeInUp 0.6s ease-out 0.8s both;
}

.testimonials-title {
  font-size: 2rem !important;
  font-weight: 800 !important;
  text-align: center;
  background: linear-gradient(135deg, #e4002b 0%, #b71c1c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.testimonial-card {
  background: linear-gradient(145deg, #ffffff 0%, #fefafa 100%);
  border-radius: 16px;
  border-left: 6px solid #e4002b;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
  position: relative;
  overflow: hidden;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(228, 0, 43, 0.1) !important;
}

.testimonial-card:hover .quote-icon {
  transform: scale(1.2);
  color: #e4002b;
}

.quote-icon {
  transition: all 0.3s ease;
}

.testimonial-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #333;
  font-style: italic;
  margin-bottom: 1rem;
}

.testimonial-author {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e4002b;
}

/* Back to Top Button */
.back-to-top {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #e4002b 0%, #b71c1c 100%);
  color: white;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-to-top:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section Dividers */
.content-row {
  position: relative;
}

.content-row:not(:last-child)::after {
  content: "";
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #e4002b, transparent);
  margin: 60px auto 40px;
}

.application-anchor {
  scroll-margin-top: 80px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero {
    padding: 80px 0;
  }

  .stat-highlight {
    transform: none;
    margin-top: 40px;
  }

  .card-title {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-cta,
  .email-btn {
    width: 100%;
  }

  .stat-highlight {
    padding: 32px 24px;
  }

  .back-to-top {
    bottom: 16px;
    right: 16px;
  }

  .main-content {
    padding-top: 60px;
    padding-bottom: 60px;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
.skip-link:focus,
.v-btn:focus-visible,
.v-card:focus-visible {
  outline: 2px solid #e4002b;
  outline-offset: 2px;
}
</style>

<!-- Global button styles -->
<style>
.v-btn {
  border-radius: 12px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  transition: all 0.3s ease !important;
}

.v-btn--size-large {
  padding: 0 32px !important;
  height: 56px !important;
  font-size: 1.1rem !important;
}

.v-btn:hover {
  transform: translateY(-2px) !important;
}

.v-text-field .v-field {
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.v-text-field .v-field--focused {
  box-shadow: 0 0 0 2px rgba(228, 0, 43, 0.2) !important;
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
