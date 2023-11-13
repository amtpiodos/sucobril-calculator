<template>
  <section> 
   <div class="grid">
      
      <div id = "app">
        <img src="../assets/img/p2.jpeg" alt="p2">
          <router-link to="/blocks"> Project 1 </router-link> 
          <router-view/>
      </div>
      

      <div>
        <img src="../assets/img/p2.jpeg" alt="p2">
      </div>

      <div>
        <img src="../assets/img/p2.jpeg" alt="p2">
      </div>

      <div>
        <img src="../assets/img/p2.jpeg" alt="p2">
      </div>

      <div>
        <img src="../assets/img/p2.jpeg" alt="p2">
      </div>
      
      <div><img src="" alt=""></div>
    </div>
  </section>
</template>

<style scoped> 
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 1rem;
  }
  .grid > div {
    background: #98d59f;
    padding: 1rem;
  }

  .grid > div::before {
    content: "";
    padding-bottom: 100%;
    display: block;
  }

  .grid > div {
    /* ... */
    display: grid;
  }

  .grid > div::before,
  .grid > div > img {
    grid-area: 1 / 1 / 2 / 2;
    width:100%;
  }

  .project-info {
    margin: 10px;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>