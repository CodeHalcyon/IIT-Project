
  // Import the functions you need from the SDKs you need
 // Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyTMyj9OO5JLuzToVBQGE_nq9SMNctdE4",
    authDomain: "zerohunger-352f3.firebaseapp.com",
    projectId: "zerohunger-352f3",
    storageBucket: "zerohunger-352f3.appspot.com",
    messagingSenderId: "712681001035",
    appId: "1:712681001035:web:aca40655a175d2dedcfdce",
    measurementId: "G-Y4FMNZTGZQ"
};

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Event listener for form submission
document.getElementById("submit").addEventListener('click', function(e) {
    e.preventDefault();

    // Capture form data
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const quantity = document.getElementById("quantity").value;

    // Write data to Firebase Realtime Database
    set(ref(db, 'users/' + fullname), {
        fullname: fullname,
        email: email,
        phone: phone,
        address: address,
        quantity: quantity
    })
    .then(() => {
        alert("Registration Successful!");
        document.getElementById("donorForm").reset();
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Failed to register. Please try again.");
    });
});
