<template>
  <section>
    <h1> Buyer Details </h1>
    <h3> {{ buyerData.lastname }}, {{ buyerData.firstname }} {{ buyerData.middlename }} </h3>
    <p> {{ buyerData.birthdate }} </p>
  </section>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["buyerData"])
  },
  mounted() {
    this.$store.dispatch("showBuyer", 1);
  }
};
</script>