<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const { locale } = useI18n()

// Ticket link configuration
const ticketLink = computed(() => props.activity?.ticketLink || 'https://docs.google.com/forms/d/e/1FAIpQLScgqGY3nAUnz_os71yLEdC5QQZkg6ezlI8xX-Qk1ExtN1RRXA/viewform')

// Format date and time
const displayDate = computed(() => props.activity?.eventDate || 'Thursday, 23 July 2026')
const displayTime = computed(() => props.activity?.eventTime || '09:00 AM – 04:00 PM')
const displayAddress = computed(() => props.activity?.eventAddress || 'VGU Campus (Lab Tour) | On-Campus & Online (Seminar)')

// Speaker metadata
const speakers = [
  {
    name: 'Dr. rer. nat. Hieu Linh Duong',
    designation: 'Researcher, VGU',
    topic: 'Production of Syzygium nervosum Leaf Extract Nano-Formulation',
    image: '/Lecturer_Avatar/Linh Duong Hieu.png',
    isMain: true
  },
  {
    name: 'Dr. Thanh Thuat Trinh',
    designation: 'Researcher, NTNU',
    topic: 'Computational Insights into Antioxidant Mechanisms: DFT Study of Terpenoids from Syzygium nervosum',
    image: '/Lecturer_Avatar/NTNU Trinh Thanh Thuat.jpg',
    isMain: false
  },
  {
    name: 'Dr. Xuan Thanh Nguyen',
    designation: 'Senior Lecturer & MSI Coordinator, VGU',
    topic: 'Computational Design for Hydrogen Storage and Purification Materials',
    image: '/Lecturer_Avatar/Thanh Nguyen Xuan.jpg',
    isMain: false
  },
  {
    name: 'Prof. Dr.-Ing. Daniel Juhre',
    designation: 'MSI Director, OVGU',
    topic: 'Gateway to Europe: Building a Global Career in Materials Science through VGU & OVGU',
    image: '/Lecturer_Avatar/Daniel Juhre.jpg',
    isMain: false,
    isMsiPromo: true
  },
  {
    name: 'Dr.-Ing. Georg Hasemann',
    designation: 'Researcher & Lecturer, OVGU',
    topic: 'Forging the Future: High-Temperature Materials and the DAAD Scholar Journey in Germany',
    image: '/Lecturer_Avatar/Georg Hasemann.jpg',
    isMain: false,
    isMsiPromo: true
  }
]

// Timeline schedule mapped from markdown or static fallback
const timelineItems = computed(() => {
  if (props.activity?.schedule && props.activity.schedule.length > 0) {
    return props.activity.schedule
  }
  return [
    { time: '09:00–12:00', title: 'Lab Tour', desc: 'Excursion and tour of the state-of-the-art laboratory facilities at VGU Campus.' },
    { time: '13:00–13:30', title: 'Dr. Hieu Linh Duong', desc: 'Production of Syzygium nervosum Leaf Extract Nano-Formulation' },
    { time: '13:30–14:00', title: 'Dr. Thuat Trinh', desc: 'Computational Insights into Antioxidant Mechanisms: DFT Study of Terpenoids from Syzygium nervosum' },
    { time: '14:00–14:30', title: 'Dr. Nguyen Xuan Thanh', desc: 'Computational Design for Hydrogen Storage and Purification Materials' },
    { time: '14:30–14:45', title: 'Break', desc: 'Networking break & refreshments.' },
    { time: '14:45–15:15', title: 'Prof. Daniel Juhre', desc: 'Gateway to Europe: Building a Global Career in Materials Science through VGU & OVGU' },
    { time: '15:15–15:45', title: 'Dr. Georg Hasemann', desc: 'Forging the Future: High-Temperature Materials and the DAAD Scholar Journey in Germany' }
  ]
})

function triggerPrint() {
  window.print()
}
</script>

<template>
  <div class="poster-page-wrapper">
    <!-- Back Link (Screen only) -->
    <div class="no-print back-link-row container">
      <NuxtLink to="/academic-activities" class="back-link">
        &larr; Back to Activities
      </NuxtLink>
    </div>

    <!-- MAIN POSTER CONTAINER -->
    <div class="poster-container">
      
      <!-- BACKGROUND MOLECULAR/PARTICLE DRAWING -->
      <div class="drawing-background">
        <svg viewBox="0 0 800 1100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Molecular Grid Network -->
          <g stroke="rgba(30, 58, 95, 0.08)" stroke-width="1.5">
            <line x1="100" y1="200" x2="250" y2="150" />
            <line x1="250" y1="150" x2="350" y2="280" />
            <line x1="350" y1="280" x2="200" y2="380" />
            <line x1="200" y1="380" x2="100" y2="200" />
            <line x1="350" y1="280" x2="500" y2="250" />
            <line x1="500" y1="250" x2="600" y2="400" />
            <line x1="600" y1="400" x2="450" y2="480" />
            <line x1="450" y1="480" x2="350" y2="280" />
            <line x1="200" y1="380" x2="280" y2="550" />
            <line x1="280" y1="550" x2="450" y2="480" />
          </g>
          
          <!-- Nodes / Particles -->
          <g fill="rgba(232, 119, 34, 0.12)">
            <circle cx="100" cy="200" r="8" />
            <circle cx="250" cy="150" r="10" />
            <circle cx="350" cy="280" r="12" />
            <circle cx="200" cy="380" r="9" />
            <circle cx="500" cy="250" r="11" />
            <circle cx="600" cy="400" r="8" />
            <circle cx="450" cy="480" r="10" />
            <circle cx="280" cy="550" r="7" />
          </g>
          <g fill="rgba(122, 0, 60, 0.08)">
            <circle cx="180" cy="180" r="5" />
            <circle cx="300" cy="220" r="6" />
            <circle cx="420" cy="380" r="5" />
            <circle cx="520" cy="450" r="6" />
          </g>

          <!-- Mathematical Wave Lines -->
          <path d="M-50,850 C200,750 400,950 600,800 C700,725 800,820 900,780" stroke="rgba(232, 119, 34, 0.1)" stroke-width="3" />
          <path d="M-50,880 C220,790 380,980 620,830 C720,755 820,850 920,810" stroke="rgba(122, 0, 60, 0.08)" stroke-width="2" />
        </svg>
      </div>

      <!-- HEADER WITH CURVY DIVIDER AND LOGOS -->
      <div class="poster-header">
        <div class="header-logos-row">
          <div class="logo-row-vgu">
            <!-- VGU Logo - Prominent -->
            <div class="logo-capsule vgu-primary-capsule">
              <NuxtImg src="/Logo/VGU_Logo.png" alt="VGU Logo" class="logo-vgu" />
            </div>
          </div>
          <div class="logo-row-partners">
            <span class="logo-coop-label">in cooperation with</span>
            <div class="partner-logos-wrap">
              <!-- OVGU Logo -->
              <div class="logo-capsule ovgu-secondary-capsule">
                <NuxtImg src="/Logo/OVGU_Logo.png" alt="OVGU Logo" class="logo-ovgu" />
              </div>
              <!-- NTNU Logo -->
              <div class="logo-capsule ntnu-secondary-capsule">
                <NuxtImg src="/Logo/Norwegian University of Science and Technology.jpg" alt="NTNU Logo" class="logo-ntnu" />
              </div>
            </div>
          </div>
        </div>

        <div class="header-titles">
          <h1 class="main-event-title">
            Workshop on Ministry-Level Scientific & Technological Research Project
          </h1>
          
          <!-- Curved and highlighted in conjunction box -->
          <div class="in-conjunction-capsule">
            <span class="conjunction-highlight">in conjunction with</span>
          </div>

          <h2 class="sub-event-title">
            Materials Science Seminar
          </h2>
        </div>

        <!-- Curvy Wave Divider (Bottom of Header) -->
        <div class="curvy-divider-wrap">
          <svg viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="curvy-divider">
            <!-- Curve 1: OVGU Burgundy -->
            <path d="M0,32 C320,128 640,0 960,96 C1120,144 1280,128 1440,64 L1440,180 L0,180 Z" fill="#7a003c" opacity="0.45"/>
            <!-- Curve 2: VGU Orange -->
            <path d="M0,80 C240,0 480,160 720,64 C960,-32 1200,112 1440,32 L1440,180 L0,180 Z" fill="#e87722" opacity="0.6"/>
            <!-- Curve 3: Main body White overlay -->
            <path d="M0,112 C360,48 720,176 1080,80 C1260,32 1350,96 1440,144 L1440,180 L0,180 Z" fill="#ffffff"/>
          </svg>
        </div>
      </div>

      <!-- MAIN CONTENT AREA -->
      <div class="poster-body">

        <!-- 1. DATE, TIME & LOCATION INFO HERO -->
        <div class="event-info-bar">
          <div class="info-card">
            <svg class="info-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div class="info-details">
              <span class="info-label">Date</span>
              <strong class="info-value">{{ displayDate }}</strong>
            </div>
          </div>
          <div class="info-card">
            <svg class="info-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div class="info-details">
              <span class="info-label">Time</span>
              <strong class="info-value">{{ displayTime }}</strong>
            </div>
          </div>
          <div class="info-card wide-card">
            <svg class="info-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div class="info-details">
              <span class="info-label">Venue</span>
              <strong class="info-value">{{ displayAddress }}</strong>
            </div>
          </div>
        </div>

        <!-- 2. SPEAKERS SECTION (3+2 GRID LAYOUT) -->
        <div class="speakers-section">
          <!-- Floating background graphic elements specifically for speakers section to make it less empty -->
          <div class="speakers-bg-nodes">
            <svg viewBox="0 0 700 350" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="150" cy="100" r="120" fill="rgba(232, 119, 34, 0.035)" />
              <circle cx="550" cy="230" r="100" fill="rgba(122, 0, 60, 0.035)" />
              <path d="M 50 175 L 650 175 M 350 20 L 350 330" stroke="rgba(30, 58, 95, 0.04)" stroke-dasharray="4 4"/>
              <!-- Connective lines / lattice decoration -->
              <path d="M120,80 L200,160 L300,120" stroke="rgba(30, 58, 95, 0.03)" stroke-width="2"/>
              <circle cx="120" cy="80" r="4" fill="rgba(30, 58, 95, 0.1)"/>
              <circle cx="200" cy="160" r="5" fill="rgba(232, 119, 34, 0.1)"/>
              <circle cx="300" cy="120" r="4" fill="rgba(122, 0, 60, 0.1)"/>
            </svg>
          </div>

          <h2 class="section-title">
            <svg class="section-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
            Speakers
          </h2>
          
          <div class="speakers-grid">
            <!-- Row 1: VGU Presenters -->
            <div class="speaker-row row-three">
              <div 
                v-for="sp in speakers.slice(0, 3)" 
                :key="sp.name" 
                class="speaker-card"
              >
                <div class="avatar-wrap">
                  <NuxtImg :src="sp.image" :alt="sp.name" class="speaker-avatar" />
                </div>
                <h3 class="speaker-name">{{ sp.name }}</h3>
                <p class="speaker-title">{{ sp.designation }}</p>
                <div class="speaker-topic">
                  <strong class="topic-label">Topic:</strong>
                  <span class="topic-text">{{ sp.topic }}</span>
                </div>
              </div>
            </div>

            <!-- Row 2: Germany (OVGU) Speakers -->
            <div class="speaker-row row-two">
              <div 
                v-for="sp in speakers.slice(3)" 
                :key="sp.name" 
                class="speaker-card"
              >
                <div class="avatar-wrap">
                  <NuxtImg :src="sp.image" :alt="sp.name" class="speaker-avatar" />
                </div>
                <h3 class="speaker-name">{{ sp.name }}</h3>
                <p class="speaker-title">{{ sp.designation }}</p>
                <div class="speaker-topic">
                  <strong class="topic-label">Topic:</strong>
                  <span class="topic-text">{{ sp.topic }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. SPLIT TIMELINE & REGISTRATION SECTION -->
        <div class="timeline-footer-split">
          
          <!-- Timeline columns -->
          <div class="timeline-box">
            <h3 class="section-title-sm">
              <svg class="section-svg-icon-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Detailed Timeline
            </h3>
            <div class="timeline">
              <div v-for="(item, idx) in timelineItems" :key="idx" class="timeline-item">
                <div class="timeline-badge-wrap">
                  <div class="timeline-badge-dot"></div>
                  <div v-if="idx < timelineItems.length - 1" class="timeline-line"></div>
                </div>
                <div class="timeline-content">
                  <span class="timeline-time">{{ item.time }}</span>
                  <h4 class="timeline-title-text">{{ item.title }}</h4>
                  <p class="timeline-desc-text">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Registration columns -->
          <div class="registration-box">
            <div class="qr-registration-card">
              <h3 class="register-header-text">Join The Event</h3>
              <p class="register-info-text">
                Free attendance. Please scan the QR code to register your participation for the Lab Tour and Seminar.
              </p>

              <!-- MSI Highlights to fill space and promote program -->
              <div class="msi-program-highlights">
                <h4 class="highlights-title">About the MSI Program:</h4>
                <ul class="highlights-list">
                  <li><strong>German Degree:</strong> Joint Master of Science in Materials Science from VGU and OVGU Magdeburg.</li>
                  <li><strong>Flexible Schedule:</strong> Designed for both full-time students and working professionals.</li>
                  <li><strong>State-of-the-art Labs:</strong> Access to cutting-edge research equipment and international projects.</li>
                  <li><strong>Career Opportunities:</strong> Pathway to industrial research roles and global PhD exchanges.</li>
                </ul>
              </div>
              
              <div class="qr-display-row">
                <a :href="ticketLink" target="_blank" rel="noopener noreferrer" class="qr-container">
                  <div class="qr-canvas">
                    <QrCode :value="ticketLink" :margin="1" color-dark="#0f2240" />
                  </div>
                  <span class="qr-scan-label">Scan to Register</span>
                </a>
              </div>

              <div class="online-access-info">
                <div class="access-item">
                  <svg class="access-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <div class="access-details">
                    <span class="access-label">Inquiries</span>
                    <span class="access-val">msi.info@vgu.edu.vn</span>
                  </div>
                </div>
              </div>

              <!-- Supported by Section -->
              <div class="supported-by-section">
                <span class="supported-by-label">Supported by:</span>
                <div class="supported-by-logos">
                  <div class="support-logo-card">
                    <NuxtImg src="/Logo/Ministry of Education and Training.jpg" class="support-logo-img" alt="MOET Logo" />
                  </div>
                  <div class="support-logo-card">
                    <NuxtImg src="/Logo/Research Management Department VGU.jpg" class="support-logo-img" alt="RMD VGU Logo" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      <!-- FOOTER STRIP -->
      <div class="poster-footer-strip">
        <div class="footer-badge">MATERIALS SCIENCE (MSI) PROGRAM</div>
        <div class="footer-motto">GERMAN QUALITY - GLOBAL CAREERS</div>
      </div>

    </div>

    <!-- Floating Print Button (Screen only) -->
    <button @click="triggerPrint" class="print-fab no-print" title="Print Poster">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="print-icon">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      <span class="print-fab-text">Print / Save PDF</span>
    </button>
  </div>
</template>

<style scoped>
/* ==========================================================================
   SCREEN STYLE (Modern dark glowing backdrop and frosted paper container)
   ========================================================================== */
.poster-page-wrapper {
  background: #060b13;
  min-height: 100vh;
  padding: 2rem 1rem;
  font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
  color: #1e3a5f;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
}

.back-link-row {
  width: 100%;
  max-width: 820px;
  margin-bottom: 1rem;
  z-index: 10;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.9rem;
  transition: transform 200ms, color 200ms;
}
.back-link:hover {
  transform: translateX(-4px);
  color: #e87722;
}

/* Compressed Poster layout */
.poster-container {
  width: 100%;
  max-width: 820px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 5;
}

/* Background overlay with VGU image */
.drawing-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.95;
  background: 
    linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)),
    url('/images/Students_Life_VGU.png') no-repeat center/cover;
}
.drawing-background svg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* HEADER COMPONENT */
.poster-header {
  background: linear-gradient(135deg, #091322 0%, #152d4e 100%);
  padding: 1.25rem 1.5rem 0 1.5rem;
  position: relative;
  color: #ffffff;
  z-index: 2;
  text-align: center;
}

.header-logos-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.6rem;
  width: 100%;
}
.logo-row-vgu {
  display: flex;
  justify-content: center;
  width: 100%;
}
.logo-row-partners {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.partner-logos-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .header-logos-row {
    flex-direction: row;
    justify-content: center;
    gap: 1.25rem;
    padding-bottom: 0.5rem;
  }
  .logo-row-vgu {
    width: auto;
  }
  .logo-row-partners {
    gap: 1.25rem;
  }
  .partner-logos-wrap {
    gap: 1.25rem;
  }
}
.logo-capsule {
  background: #ffffff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.vgu-primary-capsule {
  padding: 0.35rem 0.85rem;
}
.ovgu-secondary-capsule {
  padding: 0.25rem 0.6rem;
}
.ntnu-secondary-capsule {
  padding: 0.25rem 0.6rem;
}
.logo-vgu {
  height: 34px;
  width: auto;
}
.logo-ovgu {
  height: 20px;
  width: auto;
}
.logo-ntnu {
  height: 20px;
  width: auto;
}
.logo-coop-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 700;
}

.main-event-title {
  font-size: clamp(1.1rem, 2.8vw, 1.5rem);
  font-weight: 850;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: #ffffff;
}
.sub-event-title {
  font-size: clamp(1.1rem, 2.8vw, 1.5rem);
  font-weight: 850;
  line-height: 1.2;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: #ffffff;
}

.in-conjunction-capsule {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  background: linear-gradient(135deg, #7a003c 0%, #a30050 100%);
  padding: 0.35rem 1.25rem;
  border-radius: 8px;
  border: 1px solid #e87722;
  box-shadow: 0 4px 12px rgba(122, 0, 60, 0.25);
  margin-bottom: 0.75rem;
  transform: skewX(-6deg);
}
.conjunction-highlight {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #e87722;
  font-weight: 800;
  transform: skewX(6deg);
}
.seminar-highlight {
  font-size: 0.95rem;
  font-weight: 900;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  transform: skewX(6deg);
}

.curvy-divider-wrap {
  margin: 0 -1.5rem;
  position: relative;
  line-height: 0;
  overflow: hidden;
}
.curvy-divider {
  width: 100%;
  height: auto;
  display: block;
}

/* BODY SECTION */
.poster-body {
  padding: 1rem 1.5rem;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Info Bar */
.event-info-bar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 12px;
  padding: 0.75rem 1rem;
}
@media (min-width: 640px) {
  .event-info-bar {
    grid-template-columns: 1fr 0.9fr 2fr;
  }
}
.info-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-right: 1px solid rgba(226, 232, 240, 0.7);
  padding-right: 0.5rem;
}
.info-card:last-child {
  border-right: none;
}
@media (max-width: 639px) {
  .info-card {
    border-right: none;
    border-bottom: 1px solid rgba(226, 232, 240, 0.7);
    padding-bottom: 0.4rem;
  }
  .info-card:last-child {
    border-bottom: none;
  }
}
.info-svg-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #e87722;
  flex-shrink: 0;
}
.section-svg-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #e87722;
  flex-shrink: 0;
}
.section-svg-icon-sm {
  width: 1rem;
  height: 1rem;
  color: #e87722;
  flex-shrink: 0;
}
.access-svg-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #7a003c;
  flex-shrink: 0;
  margin-top: 2px;
}
.info-details {
  display: flex;
  flex-direction: column;
}
.info-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
}
.info-value {
  font-size: 0.82rem;
  color: #0f2240;
}

/* SPEAKERS LAYOUT */
.speakers-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  background: radial-gradient(circle at center, rgba(30, 58, 95, 0.02) 0%, transparent 80%);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.4);
}
.speakers-bg-nodes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.speakers-bg-nodes svg {
  width: 100%;
  height: 100%;
}
.section-title {
  font-size: 1.05rem;
  font-weight: 850;
  color: #0f2240;
  border-left: 4px solid #e87722;
  padding-left: 0.5rem;
  text-transform: uppercase;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  z-index: 1;
}
.speakers-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 1;
}
.speaker-row {
  display: grid;
  gap: 0.75rem;
  justify-content: center;
}
.row-three {
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .row-three {
    grid-template-columns: repeat(3, 1fr);
  }
}
.row-two {
  grid-template-columns: 1fr;
  max-width: 580px;
  margin: 0 auto;
  width: 100%;
}
@media (min-width: 640px) {
  .row-two {
    grid-template-columns: repeat(2, 1fr);
  }
}

.speaker-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid #7a003c; /* Uniform OVGU purple border */
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.avatar-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  margin-bottom: 0.5rem;
}
.main-presenter-card .avatar-wrap {
  border-color: #e87722;
}
.speaker-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.speaker-name {
  font-size: 0.85rem;
  font-weight: 800;
  color: #0f2240;
  margin: 0 0 0.1rem 0;
}
.speaker-title {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 600;
  margin: 0 0 0.4rem 0;
  text-transform: uppercase;
}
.speaker-topic {
  border-top: 1px dashed rgba(226, 232, 240, 0.7);
  padding-top: 0.4rem;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.topic-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #94a3b8;
}
.topic-text {
  font-size: 0.76rem;
  color: #1e293b;
  line-height: 1.25;
  font-style: italic;
}

/* TIMELINE AND REGISTRATION SPLIT */
.timeline-footer-split {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 768px) {
  .timeline-footer-split {
    grid-template-columns: 1.15fr 0.85fr;
  }
}

.timeline-box {
  background: rgba(248, 250, 252, 0.6);
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 12px;
  padding: 1rem;
}
.section-title-sm {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f2240;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.timeline-item {
  display: flex;
  gap: 0.75rem;
}
.timeline-badge-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.timeline-badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #e87722;
  margin-top: 3px;
}
.timeline-line {
  width: 1.5px;
  flex: 1;
  background: linear-gradient(to bottom, #e87722, rgba(232, 119, 34, 0.1));
  margin: 2px 0;
}
.timeline-content {
  padding-bottom: 0.5rem;
  flex: 1;
}
.timeline-time {
  font-size: 0.68rem;
  font-weight: 800;
  color: #ffffff;
  background: #e87722;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  display: inline-block;
}
.timeline-title-text {
  font-size: 0.82rem;
  font-weight: 750;
  color: #0f2240;
  margin: 0.1rem 0;
}
.timeline-desc-text {
  font-size: 0.74rem;
  color: #475569;
  line-height: 1.3;
  margin: 0;
}

/* Registration detail card */
.registration-box {
  display: flex;
  height: 100%;
}
.qr-registration-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  height: 100%;
  box-sizing: border-box;
}
.register-header-text {
  font-size: 0.95rem;
  font-weight: 850;
  color: #0f2240;
  margin: 0;
  text-transform: uppercase;
  border-bottom: 2px solid #e87722;
  padding-bottom: 2px;
  width: fit-content;
}
.register-info-text {
  font-size: 0.76rem;
  color: #475569;
  line-height: 1.35;
  margin: 0;
}
.msi-program-highlights {
  background: rgba(15, 34, 64, 0.02);
  border: 1px solid rgba(15, 34, 64, 0.05);
  border-radius: 8px;
  padding: 0.6rem;
  margin-top: 0.25rem;
  text-align: left;
}
.highlights-title {
  font-size: 0.72rem;
  font-weight: 800;
  color: #0f2240;
  text-transform: uppercase;
  margin: 0 0 0.35rem 0;
  letter-spacing: 0.02em;
}
.highlights-list {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.highlights-list li {
  font-size: 0.7rem;
  color: #475569;
  line-height: 1.3;
  position: relative;
  padding-left: 0.75rem;
}
.highlights-list li::before {
  content: "•";
  color: #e87722;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}
.qr-display-row {
  display: flex;
  justify-content: center;
}
.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  text-decoration: none;
}
.qr-canvas {
  width: 100px;
  height: 100px;
  background: #ffffff;
  padding: 0.4rem;
  border-radius: 8px;
  border: 1px solid rgba(15, 34, 64, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-canvas :deep(svg) {
  width: 100%;
  height: 100%;
}
.qr-scan-label {
  font-size: 0.68rem;
  font-weight: 800;
  color: #0f2240;
  text-transform: uppercase;
}

.online-access-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px dashed rgba(226, 232, 240, 0.7);
  padding-top: 0.65rem;
}
.access-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.access-icon {
  font-size: 1.1rem;
}
.access-details {
  display: flex;
  flex-direction: column;
}
.access-label {
  font-size: 0.62rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
}
.access-link {
  font-size: 0.76rem;
  font-weight: 750;
  color: #e87722;
  text-decoration: underline;
}
.access-val {
  font-size: 0.76rem;
  font-weight: 750;
  color: #0f2240;
}
.supported-by-section {
  border-top: 1px solid rgba(15, 34, 64, 0.08);
  padding-top: 0.75rem;
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
}
.supported-by-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.supported-by-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
.support-logo-card {
  background: #ffffff;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}
.support-logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
}

/* FOOTER STRIP */
.poster-footer-strip {
  background: #091322;
  padding: 0.65rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.footer-badge {
  font-size: 0.68rem;
  font-weight: 800;
  color: #ffffff;
  background: #e87722;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  letter-spacing: 0.02em;
}
.footer-motto {
  font-size: 0.65rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}

/* Print Fab Button */
.print-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 99;
  background: #e87722;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 750;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(232, 119, 34, 0.35);
}
.print-fab:hover {
  background: #d96512;
}
.print-icon {
  width: 18px;
  height: 18px;
}

/* ==========================================================================
   PRINT STYLES (A4 Portrait 210mm x 297mm - strictly 1 page fit)
   ========================================================================== */
@media print {
  @page {
    margin: 0 !important;
    size: A4 portrait !important;
  }

  body {
    margin: 0 !important;
    background: #ffffff !important;
  }

  .poster-page-wrapper {
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: 297mm !important;
    height: 297mm !important;
    width: 210mm !important;
    overflow: hidden !important;
  }
  
  .poster-container {
    width: 210mm !important;
    height: 297mm !important;
    max-width: none !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    padding: 4mm 8mm 3mm 8mm !important;
    background: #ffffff !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    overflow: hidden !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  .drawing-background {
    opacity: 0.8 !important;
    background: 
      linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
      url('/images/Students_Life_VGU.png') no-repeat center/cover !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  .poster-header {
    margin: -4mm -8mm 0 -8mm !important;
    padding: 6mm 8mm 0 8mm !important;
    background: #091322 !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  .header-logos-row {
    flex-direction: row !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 3mm !important;
    margin-bottom: 2mm !important;
    padding-bottom: 1.5mm !important;
  }
  .logo-row-vgu {
    width: auto !important;
  }
  .logo-row-partners {
    flex-direction: row !important;
    gap: 3mm !important;
  }
  .partner-logos-wrap {
    gap: 3mm !important;
  }

  .logo-capsule {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .vgu-primary-capsule {
    padding: 0.8mm 2mm !important;
  }
  .ovgu-secondary-capsule {
    padding: 0.6mm 1.5mm !important;
  }
  .ntnu-secondary-capsule {
    padding: 0.6mm 1.5mm !important;
  }
  .logo-vgu {
    height: 22px !important;
  }
  .logo-ovgu {
    height: 14px !important;
  }
  .logo-ntnu {
    height: 14px !important;
  }

  .main-event-title {
    font-size: 11pt !important;
    margin-bottom: 1.5mm !important;
    line-height: 1.15 !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
  }
  .sub-event-title {
    font-size: 11pt !important;
    margin-bottom: 2mm !important;
    line-height: 1.15 !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
  }

  .in-conjunction-capsule {
    background: #7a003c !important;
    border-color: #e87722 !important;
    padding: 1mm 4mm !important;
    margin-bottom: 2mm !important;
    border-radius: 4px !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .conjunction-highlight {
    font-size: 5.5pt !important;
    color: #e87722 !important;
  }

  .curvy-divider-wrap {
    margin: 0 -8mm !important;
  }

  .poster-body {
    padding: 2mm 6mm !important;
    gap: 2mm !important;
    flex: 1 !important;
    justify-content: space-between !important;
  }

  /* Info bar */
  .event-info-bar {
    grid-template-columns: 1.1fr 0.9fr 2fr !important;
    padding: 1.5mm 3mm !important;
    border-radius: 4px !important;
    border-width: 1px !important;
    background: #f8fafc !important;
    gap: 1.5mm !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .info-card {
    border-right-width: 1px !important;
    padding-right: 0.5mm !important;
  }
  .info-svg-icon {
    width: 3.8mm !important;
    height: 3.8mm !important;
    color: #e87722 !important;
    flex-shrink: 0 !important;
  }
  .section-svg-icon {
    width: 3.8mm !important;
    height: 3.8mm !important;
    color: #e87722 !important;
    flex-shrink: 0 !important;
  }
  .section-svg-icon-sm {
    width: 3.2mm !important;
    height: 3.2mm !important;
    color: #e87722 !important;
    flex-shrink: 0 !important;
  }
  .access-svg-icon {
    width: 3.5mm !important;
    height: 3.5mm !important;
    color: #7a003c !important;
    flex-shrink: 0 !important;
  }
  .info-label {
    font-size: 4.8pt !important;
  }
  .info-value {
    font-size: 6.8pt !important;
  }

  /* Speakers section */
  .speakers-section {
    gap: 1.5mm !important;
    padding: 1mm 2mm !important;
    border-radius: 6px !important;
    border-width: 1px !important;
    background: radial-gradient(circle at center, rgba(30, 58, 95, 0.01) 0%, transparent 80%) !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .speakers-bg-nodes {
    display: none !important;
  }
  .section-title {
    font-size: 8pt !important;
    border-left-width: 3px !important;
    padding-left: 1.5mm !important;
  }
  .speakers-grid {
    gap: 1.5mm !important;
  }
  .row-three {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.5mm !important;
  }
  .row-two {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 3mm !important;
    max-width: 110mm !important;
  }

  .speaker-card {
    padding: 1mm 1.5mm !important;
    border-radius: 6px !important;
    border: 1px solid #7a003c !important; /* Uniform OVGU purple border */
    background: #ffffff !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  .avatar-wrap {
    width: 36px !important;
    height: 36px !important;
    border-width: 1px !important;
    margin-bottom: 1mm !important;
  }
  .speaker-name {
    font-size: 6.8pt !important;
  }
  .speaker-title {
    font-size: 5pt !important;
    margin-bottom: 1mm !important;
  }
  .speaker-topic {
    padding-top: 1mm !important;
  }
  .topic-label {
    font-size: 4.8pt !important;
  }
  .topic-text {
    font-size: 6.2pt !important;
    line-height: 1.15 !important;
  }

  /* Timeline & registration split */
  .timeline-footer-split {
    grid-template-columns: 1.15fr 0.85fr !important;
    gap: 2mm !important;
  }
  .timeline-box {
    padding: 2mm 3mm !important;
    border-radius: 6px !important;
  }
  .section-title-sm {
    font-size: 7.5pt !important;
    margin-bottom: 1.5mm !important;
    display: flex !important;
    align-items: center !important;
    gap: 1mm !important;
  }
  
  .timeline-badge-dot {
    width: 5px !important;
    height: 5px !important;
    border-width: 1.2px !important;
    margin-top: 2px !important;
  }
  .timeline-line {
    margin: 1px 0 !important;
  }
  .timeline-content {
    padding-bottom: 1.2mm !important;
  }
  .timeline-time {
    font-size: 5pt !important;
    padding: 0.1mm 0.8mm !important;
  }
  .timeline-title-text {
    font-size: 6.8pt !important;
  }
  .timeline-desc-text {
    font-size: 6pt !important;
    line-height: 1.15 !important;
  }

  .registration-box {
    display: flex !important;
    height: 100% !important;
  }
  .qr-registration-card {
    padding: 2mm 3mm !important;
    border-radius: 6px !important;
    gap: 1.5mm !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    height: 100% !important;
    box-sizing: border-box !important;
  }
  .register-header-text {
    font-size: 7.5pt !important;
  }
  .register-info-text {
    font-size: 6pt !important;
    line-height: 1.15 !important;
  }
  .msi-program-highlights {
    background: #f8fafc !important;
    border: 1px solid rgba(15, 34, 64, 0.08) !important;
    border-radius: 4px !important;
    padding: 1.2mm 2mm !important;
    margin-top: 1mm !important;
    text-align: left !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .highlights-title {
    font-size: 5.5pt !important;
    margin-bottom: 0.6mm !important;
  }
  .highlights-list {
    gap: 0.6mm !important;
  }
  .highlights-list li {
    font-size: 5pt !important;
    line-height: 1.15 !important;
    padding-left: 1.5mm !important;
  }
  .qr-container {
    gap: 0.8mm !important;
  }
  .qr-canvas {
    width: 16mm !important;
    height: 16mm !important;
    border-radius: 4px !important;
    padding: 0.8mm !important;
  }
  .qr-scan-label {
    font-size: 5pt !important;
  }
  .online-access-info {
    padding-top: 1.5mm !important;
    gap: 1mm !important;
  }
  .access-icon {
    font-size: 8pt !important;
  }
  .access-label {
    font-size: 4.8pt !important;
  }
  .access-link {
    font-size: 6.2pt !important;
  }
  .access-val {
    font-size: 6.2pt !important;
  }
  .supported-by-section {
    border-top: 1px solid rgba(15, 34, 64, 0.08) !important;
    padding-top: 1.5mm !important;
    margin-top: 1mm !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 1mm !important;
    align-items: center !important;
  }
  .supported-by-label {
    font-size: 5pt !important;
    text-transform: uppercase !important;
    color: #64748b !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em !important;
  }
  .supported-by-logos {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 3mm !important;
  }
  .support-logo-card {
    background: #ffffff !important;
    border-radius: 2px !important;
    padding: 0.4mm 0.8mm !important;
    border: 0.5px solid rgba(0, 0, 0, 0.05) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .support-logo-img {
    height: 10mm !important;
    width: auto !important;
  }

  .poster-footer-strip {
    background: #091322 !important;
    padding: 2mm 8mm !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .footer-badge {
    font-size: 5pt !important;
    padding: 0.2mm 1.5mm !important;
  }
  .footer-motto {
    font-size: 5pt !important;
  }
}
</style>
