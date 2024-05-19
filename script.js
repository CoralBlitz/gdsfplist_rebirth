let sortable;

document.addEventListener('DOMContentLoaded', function() {
    loadLevels();

    if (isAdmin()) {
        document.getElementById('adminControls').style.display = 'flex';
        document.getElementById('loginBtn').style.display = 'none';
    }
});

document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminControls').style.display = 'flex';
        document.getElementById('loginBtn').style.display = 'none';
        sortable.option("disabled", false);
        loadLevels(); // Add this line to reinitialize sortable when admin logs in
    } else {
        alert('Неправильный логин или пароль');
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isAdmin');
    document.getElementById('adminControls').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'block';
    sortable.option("disabled", true);
});

document.getElementById('addLevelBtn').addEventListener('click', function() {
    document.getElementById('popupForm').style.display = 'block';
});

document.getElementById('clearLevelsBtn').addEventListener('click', function() {
    if (isAdmin()) {
        clearLevels();
    } else {
        alert('У вас нет прав для этого действия');
    }
});

document.getElementById('newLevelForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (isAdmin()) {
        const position = parseInt(document.getElementById('position').value);
        const name = document.getElementById('name').value;
        const author = document.getElementById('author').value;
        const coverInput = document.getElementById('cover');
        
        if (coverInput.files && coverInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const cover = e.target.result;

                const newLevel = {
                    position: position,
                    name: name,
                    author: author,
                    cover: cover
                };

                saveLevel(newLevel);
                displayLevels();

                document.getElementById('popupForm').style.display = 'none';
                document.getElementById('newLevelForm').reset();
            };
            
            reader.readAsDataURL(coverInput.files[0]);
        }
    } else {
        alert('У вас нет прав для этого действия');
    }
});

function saveLevel(level) {
    let levels = JSON.parse(localStorage.getItem('levels')) || [];
    levels.push(level);
    levels.sort((a, b) => a.position - b.position);  // Сортируем уровни по позиции
    localStorage.setItem('levels', JSON.stringify(levels));
}

function loadLevels() {
    displayLevels();
    if (isAdmin()) {
        document.getElementById('adminControls').style.display = 'flex';
        document.getElementById('loginBtn').style.display = 'none';
        sortable = new Sortable(document.getElementById('levelList'), { // Move sortable initialization here
            animation: 150,
            disabled: false,
            onEnd: updatePositions // Change to updatePositions
        });
    }
}

function displayLevels() {
    const levelList = document.getElementById('levelList');
    levelList.innerHTML = ''; // Очищаем список перед перерисовкой

    let levels = JSON.parse(localStorage.getItem('levels')) || [];
    levels.sort((a, b) => a.position - b.position); // Сортируем уровни по позиции

    levels.forEach(level => addLevelToList(level));
}

function addLevelToList(level) {
    const levelList = document.getElementById('levelList');
    
    const newLevel = document.createElement('div');
    newLevel.classList.add('level');
    newLevel.dataset.position = level.position; // Добавляем атрибут данных
    newLevel.draggable = true; // Add this line to enable dragging
    newLevel.innerHTML = `
        <img src="${level.cover}" alt="${level.name}">
        <div class="level-info">
            <h2>#${level.position} - ${level.name}</h2>
            <p>${level.author}</p>
        </div>
    `;
    
    levelList.appendChild(newLevel);
}

function clearLevels() {
    localStorage.removeItem('levels');
    displayLevels();
}

function updatePositions() {
    const levelElements = document.querySelectorAll('.level');
    let levels = [];
    
    levelElements.forEach((element, index) => {
        const position = index + 1;
        const name = element.querySelector('.level-info h2').textContent.split(' - ')[1];
        const author = element.querySelector('.level-info p').textContent;
        const cover = element.querySelector('img').src;

        const level = {
            position: position,
            name: name,
            author: author,
            cover: cover
        };

        levels.push(level);
        element.querySelector('.level-info h2').textContent = `#${position} - ${name}`;
    });
    
    localStorage.setItem('levels', JSON.stringify(levels));
}

function isAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
}