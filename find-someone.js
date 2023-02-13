const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USERS_PER_PAGE = 10;

let usersList = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const genderSelect = document.querySelector("#gender-select");

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
        <i class="fa-sharp fa-regular fa-heart add-to-favorite" data-id="${
          user.id
        }"></i>
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

  userModalImage.innerHTML = `<img src="${userData.avatar}" alt="avatar"             style="width:200px; height:200px;">`;
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
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = usersList.find((user)=> user.id === id)
  if (list.some((user)=>user.id === id)) {
    return  alert('This member has already added to favorite list.')
  }

  list.push(user)
  localStorage.setItem('favoriteUsers',JSON.stringify(list))
}

dataPanel.addEventListener("click", function onAvatarClciked(event) {
  if (event.target.matches(".user-avatar")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".add-to-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
    event.target.classList.remove("fa-sharp");
    event.target.classList.add("fa-solid");
    event.target.style.color = 'red'
    console.log(event.target)
  }
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  let filteredUsers = [];
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
  renderUserList(filteredUsers);
});

axios
  .get(INDEX_URL)
  .then((response) => {
    usersList.push(...response.data.results);
    renderUserList(usersList);
  })
  .catch((error) => {
    console.log(error);
  });
