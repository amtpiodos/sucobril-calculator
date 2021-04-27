<template>
  <section>
    <div> <h2> List of Buyers </h2> </div>
    <div id="item" v-for="(buyer) in buyers" :key="buyer.id">
      <h3 @click="selectBuyer(buyer.id)">{{buyer.lastname}}</h3>
    </div>
  </section>
</template>

<script>

  import { mapGetters } from "vuex";
  export default {
    computed: {
      ...mapGetters(["buyers"])
    },
    methods: {
      selectBuyer(id) {
        this.$store.dispatch("showBuyer", id)
      }
    }
  };
</script>

<style scoped>
  #item * {
    text-align: left !important;
  }
  #item {
    padding: 5px 9px;
  }
  section #item:hover {
    background: black;
    transition: ease 0.4s;
    color: white;
  }
  section #item:first-of-type {
    background: black;
    transition: ease 0.4s;
    color: white;
  }
  h3 {
    text-transform: uppercase;
    margin: 3px 0 !important;
    cursor: pointer;
  }
  p {
    text-transform: capitalize;
    color: #ced0d1;
    margin: 3px 0;
  }
</style>