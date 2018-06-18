<template>
  <div class="App">
    <div class="Row ActionRow">
      <h1>Actions</h1>
      <button class="big-btn">Add app</button>
    </div>
    <div class="Row QuickApps">
      <h1>Apps</h1>
      <div class="Apps">
        <AppsList/>
      </div>
    </div>
  </div>
</template>

<script>
  import AppsList from './components/AppsList.vue'
  export default {
    data: () => ({

    }),
    methods: {

    },
    components: {
      AppsList
    }
  }
</script>