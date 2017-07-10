<template>
  <div id="app">
    <w-header></w-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import WHeader from 'components/w-header/w-header'

  export default {
    components: {
      WHeader
    }
  }
</script>

<style>
</style>
