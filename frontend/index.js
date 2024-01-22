const repoItemList = document.getElementById('repoData');
const loader = document.getElementById('loader');
document.getElementById('searchButton').addEventListener('click', handleSearch);
document.getElementById('githubIdInput').addEventListener('keydown', handleEnterKey);
var currentPage = 1;


function handleSearch(event) {
    event.preventDefault();
    repoItemList.innerHTML = '';
    const userId = getGithubId();
    getUserData(userId);
    getRepoData(userId, currentPage);
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        repoItemList.innerHTML = '';
        const userId = getGithubId();
        getUserData(userId);
        getRepoData(userId, currentPage);
    }
}

function getGithubId() {
    const userIdInput = document.getElementById('githubIdInput');
    const userId = userIdInput.value;
    return userId;
}

function getUserData(userId) {
    const profileApi = `http://localhost:3000/user/user_profile?user_id=${userId}`;
    fetch(profileApi)
        .then(response => response.json())
        .then(data => {
            const avatarImage = document.getElementById('avatarImage');
            avatarImage.src = data.login !== undefined ? data.avatar_url : './img/default_profile.jpg';

            const nameElement = document.getElementById('name');
            nameElement.innerHTML = data.login !== undefined ? data.name : 'User Not Exist';

            document.getElementById('login').innerHTML = data.login;
            document.getElementById('bio').innerHTML = data.bio;
            document.getElementById('followers').innerHTML = `followers : <b>${data.followers}</b>`;
            document.getElementById('following').innerHTML = `following : <b>${data.following}</b>`;
            document.getElementById('location').innerHTML = `Location : <b>${data.location}</b>`;
            document.getElementById('public_repos').innerHTML = `Public Reposetory : <b>${data.public_repos}</b>`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


// ****************************** PAGINATION ANIMATION***********************************

document.addEventListener('DOMContentLoaded', function () {
    var paginationElements = document.querySelectorAll('.pagination_dv ul li');

    paginationElements.forEach(function (element) {
        element.addEventListener('click', function () {
            repoItemList.innerHTML = '';
            const userId = getGithubId();
            handelPagination(element);
            getRepoData(userId, currentPage);
        });
    });
});

function handelPagination(clickedElement) {

    if (!clickedElement.classList.contains('prev') && !clickedElement.classList.contains('next')) {
        updatePagination(clickedElement);
        currentPage = parseInt(clickedElement.querySelector('a').textContent);
    } else if (clickedElement.classList.contains('next')) {
        updatePaginationOnNext();
        currentPage = getCurrentPage();
    } else if (clickedElement.classList.contains('prev')) {
        // Handling previous button click
        updatePaginationOnPrev();
        currentPage = getCurrentPage();
    }
}

function updatePagination(element) {
    var activeElement = document.querySelector('.pagination_dv ul li a.active');
    if (activeElement) {
        activeElement.classList.remove('active');
    }
    element.querySelector('a').classList.add('active');
}

function updatePaginationOnNext() {
    var activeElement = document.querySelector('.pagination_dv ul li a.active');
    var nextElement = activeElement.parentElement.nextElementSibling;

    if (nextElement && !nextElement.classList.contains('next')) {
        updatePagination(nextElement);
    } else {
        adjustContentOfPreviousPages('increase');
    }
}

function updatePaginationOnPrev() {
    var activeElement = document.querySelector('.pagination_dv ul li a.active');
    var prevElement = activeElement.parentElement.previousElementSibling;

    if (prevElement && !prevElement.classList.contains('prev')) {
        updatePagination(prevElement);
    } else {
        adjustContentOfPreviousPages('decrease');
    }
}

function adjustContentOfPreviousPages(direction) {
    var paginationUl = document.getElementById("pagination");
    var listItems = paginationUl.querySelectorAll("li.page a");

    for (const item of listItems) {
        var newValue = direction === 'increase' ? parseInt(item.textContent) + 1 : parseInt(item.textContent) - 1;

        if (newValue >= 1) {
            item.textContent = newValue;
        } else {
            break;
        }
    }
}

function getCurrentPage() {
    var activeElement = document.querySelector('.pagination_dv ul li a.active');
    return activeElement ? parseInt(activeElement.textContent) : 1;
}


// ********************* Handel the repo and repo_data ************************


function getRepoData(userId, currentPage) {
    const limit_no = document.getElementById('limit_repo').value;
    // const limit_no = 100;

    console.log(limit_no);
    console.log(currentPage);
    // const page_no = document.getElementById('page_no').value;
    const repoApi = `http://localhost:3000/user/pagination_repo?user_id=${userId}&limit=${limit_no}&page_no=${currentPage}`;
    loader.classList.remove('hide');
    loader.classList.add('show');
    fetch(repoApi)
        .then(response => response.json())
        .then(data => {
            let repoList = data.data;
            if (repoList.alert === "data_limit_reach") {
                
                let alertElement = document.createElement('div');
                alertElement.classList.add('rp1');
                alertElement.innerHTML =
                    `
                <div class="heading style=" style="color: red; text-shadow: rgb(255, 0, 0) 1px 0 10px;" >Now we can fetch only the first 30 repositories; we can increase the limit later due to time constraints.</div>
                

                </div>
                `;

                repoItemList.appendChild(alertElement);
                loader.classList.add('hide');
                loader.classList.remove('show');
            } else {
                console.log(repoList);
                repoList.forEach(repo => {
                    let repoItem = document.createElement('div');
                    repoItem.classList.add('rp1');
                    repoItem.innerHTML =
                        `
                    <div class="heading">${repo.name}</div>
                    <div class="discription">${repo.description}</div>
                    <div class="tech_use">
                        <span class="tech_name">${repo.language}</span>
                    </div>
                    `;
                    repoItemList.appendChild(repoItem);
                    loader.classList.add('hide');
                    loader.classList.remove('show');
                });
            }

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

