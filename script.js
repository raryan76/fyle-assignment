const perPage = 10;
let currentPage = 1;

function getRepositories() {
    const username = document.getElementById('username').value;
    const repositoriesList = document.getElementById('repositories-list');
    const loader = document.getElementById('loader');
    const pagination = document.getElementById('pagination');
    const loadMoreButton = document.getElementById('load-more');

    // Clear previous results
    repositoriesList.innerHTML = '';
    pagination.innerHTML = '';
    loader.style.display = 'block';
    loadMoreButton.style.display = 'none'; // Hide the "Load More" button during initial load

    // Fetch user information using GitHub API
    fetch(`https://api.github.com/users/${username}`)
        .then(userResponse => userResponse.json())
        .then(user => {
            // Display user's bio
            const userBio = document.createElement('p');
            userBio.innerHTML = `<strong>Bio:</strong> ${user.bio || 'No bio available'}`;
            repositoriesList.appendChild(userBio);

            // Fetch repositories using GitHub API
            fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`)
                .then(response => response.json())
                .then(repositories => {
                    loader.style.display = 'none';

                    repositories.forEach(repo => {
                        const repoItem = document.createElement('div');
                        repoItem.classList.add('repository-item');

                        // Display repository owner's avatar image
                        const ownerAvatar = document.createElement('img');
                        ownerAvatar.src = repo.owner.avatar_url;
                        repoItem.appendChild(ownerAvatar);

                        // Display repository details
                        const repoDetails = document.createElement('div');
                        repoDetails.classList.add('repository-details');
                        repoDetails.innerHTML = `
                            <strong>${repo.name}</strong>: ${repo.description || 'No description available'}<br>
                            <a href="${repo.html_url}" target="_blank">GitHub URL</a>
                        `;
                        repoItem.appendChild(repoDetails);

                        repositoriesList.appendChild(repoItem);
                    });

                    // Add pagination
                    const totalPages = Math.ceil(repositories.length / perPage);
                    if (totalPages > 1) {
                        for (let i = 1; i <= totalPages; i++) {
                            const pageButton = document.createElement('button');
                            pageButton.innerText = i;
                            pageButton.onclick = () => {
                                currentPage = i;
                                getRepositories();
                            };
                            pagination.appendChild(pageButton);
                        }
                    }

                    
                    if (currentPage < totalPages) {
                        loadMoreButton.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error fetching repositories:', error);
                    repositoriesList.innerHTML = '<p style="color: red;">Error fetching repositories. Please try again.</p>';
                    loader.style.display = 'none';
                });
        })
        .catch(error => {
            console.error('Error fetching user information:', error);
            repositoriesList.innerHTML = '<p style="color: red;">Error fetching user information. Please try again.</p>';
            loader.style.display = 'none';
        });
}

function loadMoreRepositories() {
    currentPage++;
    getRepositories();
}
