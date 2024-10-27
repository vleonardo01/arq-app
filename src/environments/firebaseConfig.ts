// src/environments/firebaseConfig.ts

// Firebase configuration object
//export const firebaseConfig = {
  //apiKey: "AIzaSyCWCYHtnF30iTkyC4uhMY-VfoMAGpNs1Qk",
  //authDomain: "mobile-app-457c5.firebaseapp.com",
  //projectId: "mobile-app-457c5",
  //storageBucket: "mobile-app-457c5.appspot.com",''
  //messagingSenderId: "850381466559",
  //appId: "1:850381466559:web:a1e2f7b6327ede40914f0a",
  //measurementId: "G-KE27J59MES"};
  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDE2xakBu7uXZXTEx6eA5ryVjMckI6Pcx0",
    authDomain: "webapp-45406.firebaseapp.com",
    projectId: "webapp-45406",
    storageBucket: "webapp-45406.appspot.com",
    messagingSenderId: "855044457020",
    appId: "1:855044457020:web:2141c75921d57b38edb939",
    measurementId: "G-R148EP9V2G"
  };
  
  // Export firebaseConfig
  export { firebaseConfig };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  