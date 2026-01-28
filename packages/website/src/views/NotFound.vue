<template>
  <div class="placeholder-page">
    <div class="container">
      <div class="placeholder__content">
        <div class="placeholder__icon">🚫</div>
        <h1 class="placeholder__title">Page Not Found</h1>
        <p class="placeholder__description">
          The page you are looking for does not exist or has been moved.
        </p>
        <router-link to="/" class="btn btn-primary">
          ← Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.placeholder-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-5xl) 0;
}

.placeholder__content {
  text-align: center;
  max-width: 500px;
}

.placeholder__icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.placeholder__title {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.placeholder__description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-xl);
}
</style>