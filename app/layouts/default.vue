<script setup lang="ts">
const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = computed(() => [
  { label: t('nav.potential_candidates'), to: localePath('/future-students') },
  { label: t('nav.program_structure'), to: localePath('/program-structure') },
  { label: t('nav.academic_activities'), to: localePath('/academic-activities') },
  { label: t('nav.partners_lecturers'), to: localePath('/partners-lecturers') },
  { label: t('nav.tuition_scholarships'), to: localePath('/tuition-scholarships') },
  { label: t('nav.laboratories_research'), to: localePath('/laboratories-research') },
  { label: t('nav.student_life'), to: localePath('/student-life') },
])

const isActive = (to: string) => route.path === to
const toggleLanguage = () => {
  setLocale(locale.value === 'en' ? 'vi' : 'en')
  mobileMenuOpen.value = false
}
watch(() => route.path, () => { mobileMenuOpen.value = false })

const scrollToFooter = () => {
  const footer = document.getElementById('site-footer')
  if (footer) {
    footer.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="layout-root">

    <!-- HEADER -->
    <header class="site-header">
      <div class="header-inner container">

        <!-- MSI Logo only -->
        <NuxtLink :to="localePath('/')" class="brand-link" aria-label="MSI Home">
          <div class="brand-logo-wrapper">
            <NuxtImg
              src="/Logo/LOGO_MSI_Full_color.png"
              alt="MSI – Materials Science Program"
              class="brand-logo"
              width="210"
              height="78"
            />
          </div>
        </NuxtLink>

        <!-- Desktop Nav — grouped into 2 equal lines -->
        <nav class="desktop-nav" aria-label="Main navigation">
          <div class="nav-row">
            <NuxtLink
              v-for="link in navLinks.slice(0, 4)"
              :key="link.to"
              :to="link.to"
              :prefetch="true"
              class="nav-link"
              :class="{ 'nav-link--active': isActive(link.to) }"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
          <div class="nav-row">
            <NuxtLink
              v-for="link in navLinks.slice(4)"
              :key="link.to"
              :to="link.to"
              :prefetch="true"
              class="nav-link"
              :class="{ 'nav-link--active': isActive(link.to) }"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </nav>

        <!-- Language switcher + mobile toggle -->
        <div class="header-controls">
          <!-- Contact Us CTA -->
          <a
            href="#site-footer"
            class="contact-cta"
            @click.prevent="scrollToFooter"
          >
            {{ t('nav.contact_us') }}
          </a>

          <!-- Language buttons (EN / VI) -->
          <div class="lang-switcher">
            <button
              class="lang-btn"
              :class="{ 'lang-btn--active': locale === 'en' }"
              @click="setLocale('en')"
            >EN</button>
            <span class="lang-sep">|</span>
            <button
              class="lang-btn"
              :class="{ 'lang-btn--active': locale === 'vi' }"
              @click="setLocale('vi')"
            >VI</button>
          </div>

          <!-- Hamburger (mobile only) -->
          <button
            class="mobile-menu-btn"
            @click="mobileMenuOpen = !mobileMenuOpen"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle menu"
          >
            <span class="hamburger" :class="{ 'hamburger--open': mobileMenuOpen }">
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Drawer -->
      <Transition name="slide-down">
        <nav v-if="mobileMenuOpen" class="mobile-nav" aria-label="Mobile navigation">
          <div class="mobile-nav-inner">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link--active': isActive(link.to) }"
            >{{ link.label }}</NuxtLink>
            <div class="mobile-nav-divider" />
            <a
              href="#site-footer"
              class="mobile-contact-cta"
              @click.prevent="scrollToFooter(); mobileMenuOpen = false"
            >
              {{ t('nav.contact_us') }}
            </a>
            <div class="mobile-nav-divider" />
            <div class="mobile-lang-row">
              <button class="mobile-lang-btn" :class="{ active: locale === 'en' }" @click="setLocale('en'); mobileMenuOpen=false">English</button>
              <button class="mobile-lang-btn" :class="{ active: locale === 'vi' }" @click="setLocale('vi'); mobileMenuOpen=false">Tiếng Việt</button>
            </div>
          </div>
        </nav>
      </Transition>
    </header>

    <Transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false" />
    </Transition>

    <!-- MAIN -->
    <main class="site-main">
      <slot />
    </main>

    <!-- FOOTER -->
    <footer class="site-footer" id="site-footer">
      <div class="footer-watermark"></div>
      <div class="footer-top container">

        <div class="footer-brand">
          <p class="footer-tagline">{{ t('footer.subtitle') }}</p>
          <div class="footer-uni-logos">
            <a href="https://www.ovgu.de" target="_blank" rel="noopener noreferrer" aria-label="OVGU Website">
              <NuxtImg src="/Logo/OVGU_Logo.png" alt="OVGU" class="footer-uni-logo footer-uni-logo--ovgu" width="140" height="auto" />
            </a>
            <a href="https://vgu.edu.vn" target="_blank" rel="noopener noreferrer" aria-label="VGU Website">
              <NuxtImg src="/Logo/VGU_Logo.png" alt="VGU" class="footer-uni-logo footer-uni-logo--vgu" width="auto" height="36" />
            </a>
          </div>
          <div class="footer-uni-links">
            <a href="https://vgu.edu.vn" target="_blank" rel="noopener noreferrer" class="uni-link">Vietnamese-German University (VGU)</a>
            <a href="https://www.ovgu.de" target="_blank" rel="noopener noreferrer" class="uni-link">Otto von Guericke University Magdeburg (OVGU)</a>
          </div>
        </div>

        <div class="footer-col" style="grid-column: span 2;">
          <h4 class="footer-heading">{{ t('footer.quick_links') }}</h4>
          <ul class="footer-links footer-links--merged">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink :to="link.to" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-col footer-contact-col">
          <h4 class="footer-heading">{{ t('footer.contact') }}</h4>
          <p class="contact-welcome">
            {{ t('footer.welcome_message') }}
          </p>
          <address class="footer-address">
            Vietnamese-German University<br>
            Ring road 4, Quarter 4<br>
            Thoi Hoa Ward, Ben Cat Town<br>
            Ho Chi Minh City, Vietnam
          </address>
          <div class="contact-methods">
            <a href="mailto:msi.info@vgu.edu.vn" class="footer-email-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>msi.info@vgu.edu.vn</span>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61577622987645" target="_blank" rel="noopener noreferrer" class="footer-facebook-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              <span>{{ t('footer.facebook_fanpage') }}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <span>&copy; {{ new Date().getFullYear() }} Vietnamese-German University &amp; OVGU Magdeburg. All rights reserved.</span>
          <div class="footer-bottom-links">
            <a href="#" class="footer-bottom-link">Privacy Policy</a>
            <a href="#" class="footer-bottom-link">Imprint</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ═══════════════ LAYOUT ═══════════════ */
.layout-root { display:flex; flex-direction:column; min-height:100vh; }

/* ═══════════════ HEADER ═══════════════ */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border-bottom: 1px solid rgba(30,58,95,.10);
  box-shadow: 0 2px 16px rgba(30,58,95,.07);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-height: var(--nav-height);
  flex-wrap: wrap;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* Desktop Nav */
.desktop-nav {
  display: none;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}
.nav-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
@media (min-width: 1100px) { .desktop-nav { display: flex; } }

.nav-link {
  position: relative;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-gray-700);
  text-decoration: none;
  padding: 0.4rem 0.6rem;
  transition: color 200ms;
  white-space: nowrap;
  border-radius: var(--radius-sm);
}
.nav-link::after {
  content:'';
  position:absolute;
  bottom:0;
  left:0.6rem;
  right:0.6rem;
  height:2px;
  background: var(--color-accent);
  border-radius:2px;
  transform:scaleX(0);
  transition: transform 200ms var(--ease-out);
}
.nav-link:hover { color: var(--color-primary); }
.nav-link:hover::after { transform: scaleX(1); }
.nav-link--active { color: var(--color-primary); font-weight: 700; }
.nav-link--active::after { transform: scaleX(1); }

/* Controls */
.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  flex-shrink: 0;
}

.lang-switcher {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  padding: 0.15rem 0.4rem;
}
.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-gray-500);
  padding: 0.15rem 0.35rem;
  border-radius: var(--radius-full);
  transition: all 200ms;
}
.lang-btn:hover { color: var(--color-primary); }
.lang-btn--active {
  background: var(--color-primary);
  color: #fff !important;
  padding: 0.15rem 0.45rem;
}
.lang-sep { color: var(--color-gray-300); font-size: 0.65rem; user-select:none; }

/* Hamburger */
.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px; height: 38px;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 200ms;
}
@media (min-width: 1100px) { .mobile-menu-btn { display: none; } }
.mobile-menu-btn:hover { background: var(--color-primary-50); border-color: var(--color-primary); }

.hamburger { display:flex; flex-direction:column; gap:5px; width:18px; }
.hamburger span { display:block; height:2px; background:var(--color-gray-700); border-radius:2px; transition:all 300ms var(--ease-out); transform-origin:center; }
.hamburger--open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
.hamburger--open span:nth-child(2) { opacity:0; transform:scaleX(0); }
.hamburger--open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

/* Mobile Nav */
.mobile-nav { border-top:1px solid var(--color-gray-200); background:#fff; box-shadow:var(--shadow-lg); }
.mobile-nav-inner { display:flex; flex-direction:column; padding:1rem 1.5rem 1.5rem; gap:0.25rem; max-width:480px; margin:0 auto; }
.mobile-nav-link { display:block; font-size:0.95rem; font-weight:500; color:var(--color-gray-700); text-decoration:none; padding:0.625rem 0.75rem; border-radius:var(--radius-md); transition:all 200ms; }
.mobile-nav-link:hover, .mobile-nav-link--active { background:var(--color-primary-50); color:var(--color-primary); font-weight:600; }
.mobile-nav-divider { height:1px; background:var(--color-gray-200); margin:0.5rem 0; }
.mobile-lang-row { display:flex; gap:0.5rem; }
.mobile-lang-btn { flex:1; padding:0.5rem; font-size:0.875rem; font-weight:600; border:1px solid var(--color-gray-200); border-radius:var(--radius-md); background:#fff; color:var(--color-gray-600); cursor:pointer; transition:all 200ms; }
.mobile-lang-btn.active { background:var(--color-primary); color:#fff; border-color:var(--color-primary); }
.mobile-overlay { position:fixed; inset:0; background:rgba(0,0,0,.25); z-index:99; backdrop-filter:blur(2px); }

/* ═══════════════ MAIN ═══════════════ */
.site-main { flex:1; }

/* ═══════════════ FOOTER ═══════════════ */
.site-footer { position: relative; background: var(--color-primary-dark); color: #e2e8f0; overflow: hidden; }

.footer-watermark {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url('/Logo/LOGO_MSI_Dark.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.08;
  pointer-events: none;
  z-index: 1;
}

.footer-top {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding-top: 4rem;
  padding-bottom: 3rem;
}
@media (min-width: 640px) { .footer-top { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1024px) { .footer-top { grid-template-columns: 2fr 2fr 1.5fr; } }

.footer-tagline { font-size:0.875rem; color:rgba(255,255,255,.55); line-height:1.65; margin-bottom:1.25rem; max-width:260px; z-index: 2; }

.footer-uni-logos {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  background: #fff;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  width: fit-content;
}
.footer-uni-logo {
  height: 36px;
  width: auto;
  object-fit: contain;
  transition: opacity 200ms;
}
.footer-uni-logo:hover { opacity: 0.8; }

.footer-heading { font-family:var(--font-sans); font-size:0.7rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.4); margin-bottom:0.875rem; }

.footer-links { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.5rem; }
.footer-links--merged { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; }
.footer-link { font-size:0.875rem; color:rgba(255,255,255,.55); text-decoration:none; transition:color 200ms; }
.footer-link:hover { color:#fff; }

.footer-address { font-size:0.875rem; color:rgba(255,255,255,.55); line-height:1.7; font-style:normal; margin-bottom:0.875rem; }
.footer-email { font-size:0.875rem; font-weight:600; color:var(--color-accent-light); text-decoration:none; transition:color 200ms; }
.footer-email:hover { color:#fff; }

.footer-bottom { border-top:1px solid rgba(255,255,255,.06); background:rgba(0,0,0,.2); }
.footer-bottom-inner { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; padding-top:1.25rem; padding-bottom:1.25rem; font-size:0.78rem; color:rgba(255,255,255,.3); }
.footer-bottom-links { display:flex; gap:1.25rem; }
.footer-bottom-link { color:rgba(255,255,255,.3); text-decoration:none; transition:color 200ms; }
.footer-bottom-link:hover { color:rgba(255,255,255,.6); }

/* ═══════════════ TRANSITIONS ═══════════════ */
.slide-down-enter-active, .slide-down-leave-active { transition:all 300ms var(--ease-out); overflow:hidden; }
.slide-down-enter-from, .slide-down-leave-to { opacity:0; transform:translateY(-8px); }
.fade-enter-active, .fade-leave-active { transition:opacity 300ms; }
.fade-enter-from, .fade-leave-to { opacity:0; }

/* ═══════════════ CONTACT US CTA & FOOTER ENHANCEMENTS ═══════════════ */
.contact-cta {
  display: inline-flex;
  align-items: center;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--color-accent);
  border: 1.5px solid var(--color-accent);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  text-decoration: none;
  transition: all 250ms var(--ease-out);
  white-space: nowrap;
}
.contact-cta:hover {
  background: var(--color-accent);
  color: #fff;
  box-shadow: 0 4px 14px rgba(232, 119, 34, 0.25);
  transform: translateY(-1px);
}
.contact-cta:active {
  transform: translateY(0);
}

.mobile-contact-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  background: var(--color-accent);
  border: 1.5px solid var(--color-accent);
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  text-align: center;
  transition: all 200ms;
}
.mobile-contact-cta:hover {
  background: var(--color-accent-dark);
  border-color: var(--color-accent-dark);
}

.footer-contact-col {
  display: flex;
  flex-direction: column;
}

.footer-contact-col .footer-heading {
  color: var(--color-accent-light) !important;
  position: relative;
  padding-bottom: 6px;
  margin-bottom: 1.25rem;
  display: inline-block;
  width: fit-content;
}

.footer-contact-col .footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 24px;
  height: 2px;
  background: var(--color-accent);
  border-radius: var(--radius-full);
}

.contact-welcome {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  border-left: 2px solid var(--color-accent);
  padding-left: 0.75rem;
  margin-bottom: 1.25rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.footer-email-link,
.footer-facebook-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent-light);
  text-decoration: none;
  transition: all 200ms ease;
  width: fit-content;
}

.footer-email-link:hover,
.footer-facebook-link:hover {
  color: #fff;
  transform: translateX(4px);
}

.contact-icon {
  flex-shrink: 0;
  stroke: currentColor;
}

.footer-uni-links {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1rem;
  max-width: 280px;
}

.uni-link {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  transition: color 200ms;
  line-height: 1.4;
}

.uni-link:hover {
  color: #fff;
}

@media (max-width: 480px) {
  .contact-cta {
    padding: 0.2rem 0.55rem;
    font-size: 0.7rem;
  }
}

@media (max-width: 768px) {
  .header-inner {
    flex-wrap: nowrap;
    gap: 0.5rem;
  }
  .brand-logo-wrapper {
    margin-top: -6px;
    margin-bottom: -6px;
    padding: 0.1rem 0.25rem;
    border-radius: var(--radius-sm);
  }
  .brand-logo {
    height: 38px !important;
    width: auto !important;
  }
}

.brand-link {
  margin-left: -0.5rem !important;
}

/* Intermediate screens navigation adjustment */
@media (min-width: 1100px) and (max-width: 1300px) {
  .nav-link {
    font-size: 0.75rem !important;
    padding: 0.3rem 0.45rem !important;
  }
  .header-inner {
    gap: 0.75rem !important;
  }
  .brand-logo-wrapper {
    padding: 0.1rem 0.35rem !important;
  }
  .brand-logo {
    height: 60px !important;
  }
}

/* Global button and link font override to guarantee Be Vietnam Pro */
button,
input,
select,
textarea,
.btn,
a.btn,
.contact-cta,
.mobile-contact-cta,
.lang-btn {
  font-family: var(--font-sans) !important;
}
</style>
