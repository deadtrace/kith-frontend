<template>
    <router-view></router-view>
</template>

<script>
export default {
    name: "App",
    data: () => ({}),
    metaInfo: {
      title: 'Знакомые',
      titleTemplate: '%s | Знакомые'
    }
};
</script>

<style src="@/main.css"></style>