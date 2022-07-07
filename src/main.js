import { createApp } from 'vue';
import { initializeApp } from 'firebase/app';
import App from './App.vue';

const firebaseConfig = {
  apiKey: "AIzaSyBTZqpftdmLmfzQzsDnWFLBOCvCWiGjOEg",
  authDomain: "actor-lookup.firebaseapp.com",
  projectId: "actor-lookup",
  storageBucket: "actor-lookup.appspot.com",
  messagingSenderId: "971378605720",
  appId: "1:971378605720:web:13ec12a11e23f24fde1aed"
};

initializeApp(firebaseConfig);

createApp(App).mount('#app')
