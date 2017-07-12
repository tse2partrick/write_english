<template>
  <div id="app" class="app">
    <w-header></w-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import WHeader from 'components/w-header/w-header'
  import {mapGetters} from 'vuex'
  import {showMode, CSS} from 'common/js/config'
  export default {
    mounted() {
      this._changeCls()
    },
    components: {
      WHeader
    },
    computed: {
      ...mapGetters([
        'mode'
      ])
    },
    methods: {
      _changeCls() {
        let html = document.getElementsByTagName('html')[0]
        switch (this.mode) {
          case showMode.day:
            html.style.background = CSS.day.background
            html.style.color = CSS.day.colorTheme
            break
          case showMode.night:
            html.style.background = CSS.night.background
            html.style.color = CSS.night.colorTheme
            break
        }
        /* if (this.mode === showMode.day) {
          html.style.background = CSS.day.white
          html.style.color = CSS.day.colorTheme
        }
        if (this.mode === showMode.) */
      }
    },
    watch: {
      mode() {
        this._changeCls()
      }
    }
  }
</script>

<style lang="stylus">
</style>
