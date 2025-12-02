const usernameInput = document.getElementById('username-input');
const searchBtn = document.getElementById('search-btn');
const container = document.getElementById('container');
const loading = document.querySelector('.loading');
const errorMessage = document.querySelector('.error-message');

async function getData(username) {
    if (!username) {
        showError('Please enter a username');
        return;
    }

    loading.classList.add('active');
    errorMessage.classList.remove('active');
    container.innerHTML = '';

    try {
        let data = await fetch(`https://api.github.com/users/${username}`);
        
        if (!data.ok) {
            throw new Error('User not found');
        }
        
        data = await data.json();
        
        let followers = await fetch(data.followers_url);
        followers = await followers.json();

        displayProfile(data, followers);
    } catch (error) {
        showError('Error: ' + error.message);
    } finally {
        loading.classList.remove('active');
    }
}

function displayProfile(data, followers) {
    let profileHTML = `
        <div class="profile-card">
            <div class="profile-image">
                <img src="${data.avatar_url}" alt="${data.name || data.login}">
            </div>
            <div class="profile-info">
                <h1>${data.name || data.login}</h1>
                <p class="username">@${data.login}</p>
                ${data.bio ? `<p class="bio">${data.bio}</p>` : ''}
                <div class="stats">
                    <div class="stat-item">
                        <div class="number">${data.public_repos}</div>
                        <div class="label">Repositories</div>
                    </div>
                    <div class="stat-item">
                        <div class="number">${data.followers}</div>
                        <div class="label">Followers</div>
                    </div>
                    <div class="stat-item">
                        <div class="number">${data.following}</div>
                        <div class="label">Following</div>
                    </div>
                </div>
                <a href="${data.html_url}" target="_blank" class="profile-link">View Profile</a>
            </div>
        </div>
    `;

    if (followers.length > 0) {
        profileHTML += `<h2 class="followers-title">👥 Followers (${followers.length})</h2>`;
        profileHTML += '<div class="followers-grid">';
        
        followers.forEach((follower, index) => {
            profileHTML += `
                <div class="follower-card" style="animation-delay: ${index * 0.05}s">
                    <img src="${follower.avatar_url}" alt="${follower.login}">
                    <h3>${follower.login}</h3>
                    <a href="${follower.html_url}" target="_blank">View Profile</a>
                </div>
            `;
        });
        
        profileHTML += '</div>';
    }

    container.innerHTML = profileHTML;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
    setTimeout(() => {
        errorMessage.classList.remove('active');
    }, 3000);
}

searchBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    getData(username);
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const username = usernameInput.value.trim();
        getData(username);
    }
});