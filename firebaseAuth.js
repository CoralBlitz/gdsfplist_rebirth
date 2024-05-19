import { auth } from './firebaseConfig.js';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authForm = document.getElementById('authForm');

loginBtn.addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'block';
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            document.getElementById('loginForm').style.display = 'none';
        })
        .catch((error) => {
            alert('Ошибка входа: ' + error.message);
        });
});

logoutBtn.addEventListener('click', () => {
    signOut(auth);
});
