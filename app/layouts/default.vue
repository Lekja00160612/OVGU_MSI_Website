<script setup lang="ts">
const { t, locale, setLocale } = useI18n({
  useScope: 'global',
  messages: {
    en: {
      nav: {
        home: 'Home',
        potential_candidates: 'Potential Candidates',
        program_structure: 'Program Structure',
        academic_activities: 'Academic Activities',
        partners_lecturers: 'Partners & Lecturers',
        tuition_scholarships: 'Tuition & Scholarships',
        laboratories_research: 'Laboratories & Research',
        student_life: 'Student Life'
      },
      footer: {
        subtitle: 'A joint program between Vietnamese-German University (VGU) and Otto von Guericke University Magdeburg (OVGU).',
        quick_links: 'Quick Links',
        contact: 'Contact'
      }
    },
    vi: {
      nav: {
        home: 'Trang Chủ',
        potential_candidates: 'Ứng Viên Tiềm Năng',
        program_structure: 'Chương Trình Học',
        academic_activities: 'Trải Nghiệm Học Thuật',
        partners_lecturers: 'Đối Tác & Giảng Viên',
        tuition_scholarships: 'Học Phí & Học Bổng',
        laboratories_research: 'Thiết Bị & Nghiên Cứu',
        student_life: 'Đời Sống Sinh Viên'
      },
      footer: {
        subtitle: 'Chương trình liên kết giữa Đại học Việt Đức (VGU) và Đại học Otto von Guericke Magdeburg (OVGU).',
        quick_links: 'Liên Kết Nhanh',
        contact: 'Liên Hệ'
      }
    }
  }
})
const localePath = useLocalePath()
const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = computed(() => [
  { label: t('nav.potential_candidates'), to: localePath('/potential-candidates') },
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
              width="160"
              height="56"
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
              class="nav-link"
              :class="{ 'nav-link--active': isActive(link.to) }"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </nav>

        <!-- Language switcher + mobile toggle -->
        <div class="header-controls">
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
    <footer class="site-footer">
      <div class="footer-top container">

        <div class="footer-brand">
          <NuxtImg src="/Logo/LOGO_MSI_Bright.png" alt="MSI Program" class="footer-logo" width="160" height="56" />

          <p class="footer-tagline">{{ t('footer.subtitle') }}</p>
          <div class="footer-uni-logos">
            <NuxtImg src="/Logo/OVGU_Logo.png" alt="OVGU" class="footer-uni-logo footer-uni-logo--ovgu" width="140" height="auto" />
            <NuxtImg src="/Logo/VGU_Logo.png" alt="VGU" class="footer-uni-logo footer-uni-logo--vgu" width="auto" height="36" />
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

        <div class="footer-col">
          <h4 class="footer-heading">{{ t('footer.contact') }}</h4>
          <address class="footer-address">
            Vietnamese-German University<br>
            Ring road 4, Quarter 4<br>
            Thoi Hoa Ward, Ben Cat Town<br>
            Ho Chi Minh City, Vietnam
          </address>
          <a href="mailto:msi.info@vgu.edu.vn" class="footer-email">msi.info@vgu.edu.vn</a>
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

/* Brand */
.brand-link { flex-shrink: 0; display:flex; align-items:center; text-decoration: none; }
.brand-logo-wrapper {
  background: transparent;
  padding: 0.4rem 1rem;
  border: 1.5px solid rgba(30, 58, 95, 0.15);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 250ms ease;
}
.brand-logo-wrapper:hover { 
  transform: translateY(-2px); 
  border-color: rgba(30, 58, 95, 0.4);
  box-shadow: 0 6px 16px rgba(30, 58, 95, 0.08); 
}
.brand-logo { height: 48px; width: auto; object-fit:contain; display:block; filter: none; }

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
  gap: 0.75rem;
  margin-left: auto;
  flex-shrink: 0;
}

.lang-switcher {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  padding: 0.2rem 0.5rem;
}
.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--color-gray-500);
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-full);
  transition: all 200ms;
}
.lang-btn:hover { color: var(--color-primary); }
.lang-btn--active {
  background: var(--color-primary);
  color: #fff !important;
  padding: 0.2rem 0.6rem;
}
.lang-sep { color: var(--color-gray-300); font-size: 0.75rem; user-select:none; }

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
.site-footer { background: var(--color-primary-dark); color: #e2e8f0; }

.footer-top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding-top: 4rem;
  padding-bottom: 3rem;
}
@media (min-width: 640px) { .footer-top { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1024px) { .footer-top { grid-template-columns: 2fr 2fr 1.5fr; } }

.footer-logo { height:72px; width:auto; object-fit:contain; margin-bottom:1rem; }

.footer-tagline { font-size:0.875rem; color:rgba(255,255,255,.55); line-height:1.65; margin-bottom:1.25rem; max-width:260px; }

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
</style>
