<template>
    <div id="app">
        <Header />
        <main class="main">
            <router-view />
        </main>
        <Footer />
    </div>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
    name: 'App',
    components: {
        Header,
        Footer
    }
}
</script>

<style>
.main {
    flex: 1;
}
</style>
