<template>
    <div class="home">
        <HeroSection />
        <FeaturesGrid />
        <QuickStart />
        <PerformanceStats />
        <UseCases />
    </div>
</template>

<script>
import PerformanceStats from '@/components/home/PerformanceStats.vue'
import FeaturesGrid from '@/components/home/FeaturesGrid.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import QuickStart from '@/components/home/QuickStart.vue'
import UseCases from '@/components/home/UseCases.vue'

export default {
    name: 'Home',
    components: {
        HeroSection,
        FeaturesGrid,
        QuickStart,
        PerformanceStats,
        UseCases
    }
}
</script>

<style scoped>
.home {
    min-height: calc(100vh - 4rem);
}
</style>
