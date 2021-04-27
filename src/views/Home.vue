<template>
  <div class="grid-container" v-bind:style="{height:height+'px'} ">
    <div class="Buyers">
      <buyerslist />
    </div>
    <div class="Details">
      <buyerdetails />
    </div>
  </div>
</template>

<script>
  import buyerslist from "@/components/BuyersList.vue";
  import buyerdetails from "@/components/BuyerDetails.vue";
  export default {
    name: "Home",
    components: {
      buyerdetails,
      buyerslist
    },
    data() {
      return {
        height: window.innerHeight
      };
    }
  };
</script>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: 0.55fr 1fr;
    grid-template-rows: 1fr;
    gap: 0px 0px;
    grid-template-areas: "Notes Content";
  }
  .Buyers {
    grid-area: Notes;
    border-right: 2px dotted black;
  }
  .Details {
    grid-area: Content;
  }
</style>