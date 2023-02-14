const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USERS_PER_PAGE = 10;

let usersList = [];
let filteredUsers = [];
const list = JSON.parse(localStorage.getItem("favoriteUsers")) || [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const genderSelect = document.querySelector("#gender-select");
const paginator = document.querySelector("#paginator");

function renderUserList(users) {
  let rawHTML = "";
  for (let user of users) {
    rawHTML += `<div class="card mt-3 ms-2 pt-3 d-flex align-items-center shadow p-3 bg-body rounded" style="width: 16rem;">
        <img src="${user.avatar}"          
            class="card-img-top user-avatar border rounded-circle shadow-sm bg-body rounded" 
            alt="avatar"
            data-bs-toggle="modal" 
            data-bs-target="#user-modal"
            data-id="${user.id}"
            style="width:150px; height:150px;"
            >
        <div class="card-body">
          <h5 class="text-center">${showGenderIcon(user.gender)} ${
      user.name
    } </h5>
          <h6 class="text-center">Age : ${user.age}</h6>
          <h6 class="text-center">Region : ${user.region}</h6>
        </div>
        <i class="${turnHeartTosolid(
          user.id
        )} fa-regular fa-heart add-to-favorite" data-id="${user.id}"></i>
      </div>`;
  }

  dataPanel.innerHTML = rawHTML;
}
//判斷card上面 姓名前的gender icon是男還是女
function showGenderIcon(gender) {
  if (gender.toLowerCase() === "male") {
    return '<i class="fa-solid fa-mars"></i>';
  } else if (gender.toLowerCase() === "female") {
    return '<i class="fa-solid fa-venus"></i>';
  }
}

function showUserModal(id) {
  const userModalTItle = document.querySelector("#user-modal-title");
  const userModalImage = document.querySelector("#user-modal-image");
  const userModalInfo = document.querySelector("#user-modal-info");
  const userData = usersList.find((user) => user.id === id);

  userModalImage.innerHTML = `<img src="${userData.avatar}" alt="avatar" style="width:200px; height:200px;">`;
  userModalTItle.innerText = `${userData.name} ${userData.surname}`;
  userModalInfo.innerHTML = `
            <p>Gender : ${userData.gender}</p>
            <p>Age : ${userData.age}</p>
            <p>Birthday : ${userData.birthday}</p>
            <p>Region : ${userData.region}</p>
            <p>Email : ${userData.email}</p>
  `;
}

function addToFavorite(id) {
  const user = usersList.find((user) => user.id === id);
  if (list.some((user) => user.id === id)) {
    return alert("This member has already added to favorite list.");
  }

  list.push(user);
  localStorage.setItem("favoriteUsers", JSON.stringify(list));
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : usersList;
  const startIndex = (page - 1) * USERS_PER_PAGE;
  return data.slice(startIndex, startIndex + USERS_PER_PAGE);
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE);
  let rawHTML = ``;
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function turnHeartTosolid(id) {
  if (list.some((user) => user.id === id)) {
    return "fa-solid";
  }
  return ""; //避免回傳undefined
}

dataPanel.addEventListener("click", function onAvatarClciked(event) {
  if (event.target.matches(".user-avatar")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".add-to-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
    event.target.classList.add("fa-solid");
  }
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  const gender = Number(genderSelect.value); // 0=male, 1=female, 2=all
  filteredUsers = usersList.filter((user) =>
    user.region.toLowerCase().includes(keyword)
  );
  if (gender === 0) {
    filteredUsers = filteredUsers.filter((user) => user.gender === "male");
  } else if (gender === 1) {
    filteredUsers = filteredUsers.filter((user) => user.gender === "female");
  }

  if (filteredUsers.length === 0) {
    return alert(`Can't find the member from the region: ${keyword}.`);
  }
  renderPaginator(filteredUsers.length);
  renderUserList(getUsersByPage(1));
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;

  const page = Number(event.target.dataset.page);
  renderUserList(getUsersByPage(page));
});

axios
  .get(INDEX_URL)
  .then((response) => {
    usersList.push(...response.data.results);
    renderUserList(getUsersByPage(1));
    renderPaginator(usersList.length);
  })
  .catch((error) => {
    console.log(error);
  });
