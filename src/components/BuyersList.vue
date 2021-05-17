<template>
  <section>
    <div> <h2> List of Buyers </h2> </div>
    <div id="item" v-for="(buyer) in buyers" :key="buyer.id">
      <h3 @click="selectBuyer(buyer.id)">{{buyer.lastname}}</h3>
    </div>
  </section>
</template>

<script>
import { ipcRenderer } from 'electron';

  export default {
    data() {
      return {
        buyers: this.getBuyers()
      }
      
    },
    methods: { 
      getBuyers() {
        let buyersList = []
        ipcRenderer.send('fetchAllBuyers')
        ipcRenderer.once('fetchedAllBuyers', (event, buyers) => {
          buyers.forEach(buyer => {
            buyersList.push(buyer)
          })
        })
        console.log('buyers', buyersList)
        return buyersList
        // const buyers = [
        //     { id: 1, lastname: 'Murphy'},
        //     { id: 2, lastname: 'Reynolds'},
        //     { id: 3, lastname: 'Jabowski'}
        //   ]
        // console.log('buyers', buyers)
        // return buyers
      },
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