<template>
  <v-app>
    <Header/>
    
    <Footer/>
    

    <v-main>
      
      
      
    </v-main>
  </v-app>
</template>

<script>

import Footer from './components/Footer.vue';
import Header from './components/Header.vue';

export default {
  
  name: 'App',

  components: {
    Footer, Header,
   
    
  },

  data: () => ({
    //
  }),
};
</script>
