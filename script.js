import { auth, db } from './firebaseConfig.js';
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import './firebaseAuth.js';

document.addEventListener('DOMContentLoaded', () => {
    loadLevels();

    let sortable = new Sortable(document.getElementById('levelList'), {
        animation: 150,
        disabled: !isAdmin(),
        onEnd: function () {
            if (isAdmin()) {
                updatePositions();
            } else {
                loadLevels(); // revert if not admin
            }
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('adminControls').style.display = 'flex';
            document.getElementById('loginBtn').style.display = 'none';
        } else {
            document.getElementById('adminControls').style.display = 'none';
            document.getElementById('loginBtn').style.display = 'block';
            sortable.option("disabled", true);
        }
    });
});

function isAdmin() {
    return !!auth.currentUser;
}

document.getElementById('addLevelBtn').addEventListener('click', () => {
    document.getElementById('popupForm').style.display = 'block';
});

document.getElementById('newLevelForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const position = parseInt(document.getElementById('position').value);
    const name = document.getElementById('name').value;
    const author = document.getElementById('author').value;
    const coverFile = document.getElementById('cover').files[0];

    if (!coverFile) {
        alert('Пожалуйста, выберите файл обложки.');
        return;
    }

    const cover = await uploadCover(coverFile);

    await addDoc(collection(db, 'levels'), {
        position: position,
        name: name,
        author: author,
        cover: cover
    });

    document.getElementById('popupForm').style.display = 'none';
    loadLevels();
});

document.getElementById('clearLevelsBtn').addEventListener('click', async () => {
    const levels = await getDocs(collection(db, 'levels'));
    levels.forEach(async (level) => {
        await deleteDoc(doc(db, 'levels', level.id));
    });
    loadLevels();
});

async function loadLevels() {
    const levelList = document.getElementById('levelList');
    levelList.innerHTML = '';

    const q = query(collection(db, 'levels'), orderBy('position'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const level = doc.data();
        const levelElement = document.createElement('div');
        levelElement.classList.add('level');
        levelElement.innerHTML = `
            <img src="${level.cover}" alt="Cover">
            <div class="level-info">
                <h2>#${level.position} - ${level.name}</h2>
                <p>${level.author}</p>
            </div>
        `;
        levelList.appendChild(levelElement);
    });

    let sortable = new Sortable(document.getElementById('levelList'), {
        animation: 150,
        disabled: !isAdmin(),
        onEnd: function () {
            if (isAdmin()) {
                updatePositions();
            } else {
                loadLevels(); // revert if not admin
            }
        }
    });
}

async function uploadCover(file) {
    // Simulate file upload and return a URL.
    // Replace this with actual upload logic, e.g., Firebase Storage.
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

async function updatePositions() {
    const levelList = document.getElementById('levelList').children;
    for (let i = 0; i < levelList.length; i++) {
        const levelElement = levelList[i];
        const position = i + 1;

        const q = query(collection(db, 'levels'), where("position", "==", parseInt(levelElement.querySelector('.level-info h2').textContent.split(' ')[0].slice(1))));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
                position: position
            });
        });

        levelElement.querySelector('.level-info h2').textContent = `#${position} - ${levelElement.querySelector('.level-info h2').textContent.split(' ')[1]}`;
    }
}
