<script setup lang="ts">
useSeoMeta({
  title: 'Admin Dashboard | MSI',
  robots: 'noindex, nofollow'
})
</script>

<template>
  <div class="admin-portal">
    <div class="container admin-container text-center">
      <div class="admin-card">
        <div class="admin-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
        </div>
        <h1 class="admin-title">Content Management System</h1>
        <p class="admin-desc">
          The MSI Website content (Curriculum, Activities, Partners) is fully managed through Nuxt Studio. Click below to launch the editor and modify the live content.
        </p>
        <a href="https://nuxt.studio" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg mt-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.127l-3.196.101a.75.75 0 01-.81-.81l.102-3.196a4.5 4.5 0 011.127-1.89l14.65-14.652zM16.862 4.487L19.5 7.125" /></svg>
          Launch Nuxt Studio Editor
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-portal {
  min-height: 80vh;
  background: var(--color-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
}
.admin-container {
  max-width: 600px;
}
.admin-card {
  background: #fff;
  padding: 4rem 3rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
}
.admin-icon {
  width: 80px;
  height: 80px;
  background: var(--color-primary-50);
  color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem auto;
}
.admin-icon svg {
  width: 40px;
  height: 40px;
}
.admin-title {
  font-size: 2.25rem;
  color: var(--color-primary-dark);
  margin-bottom: 1rem;
}
.admin-desc {
  font-size: 1.1rem;
  color: var(--color-gray-600);
  line-height: 1.7;
}
.btn-lg {
  padding: 1rem 2.5rem;
  font-size: 1.15rem;
  width: 100%;
}
.btn-icon {
  width: 22px;
  height: 22px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}
</style>
