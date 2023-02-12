const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const USERS_PER_PAGE = 10

let usersList = []

const dataPanel = document.querySelector('#data-panel')

function renderUserList(users) {
  let rawHTML = ''
  for (let user of users) {
    rawHTML += `<div class="card mt-3 pt-3 d-flex align-items-center shadow p-3 bg-body rounded" style="width: 16rem;">
        <img src="${user.avatar}"          
            class="card-img-top user-avatar border rounded-circle shadow-sm bg-body rounded" 
            alt="avatar"
            data-bs-toggle="modal" 
            data-bs-target="#user-modal"
            data-id="${user.id}"
            style="width:150px; height:150px;"
            >
        <div class="card-body">
          <h5 class="text-center">${showGenderIcon(user.gender)} ${user.name} </h5>
          <h6 class="text-center">Age : ${user.age}</h6>
          <h6 class="text-center">Region : ${user.region}</h6>
        </div>
        <span class="add-to-favorite" data-id="${user.id}"><i class="fa-sharp fa-regular fa-heart"></i></span>
      </div>`
  }

  dataPanel.innerHTML = rawHTML
}

function showGenderIcon(gender) {
  if (gender.toLowerCase() === 'male') {
    return '<i class="fa-solid fa-mars"></i>'
  } else if (gender.toLowerCase() === 'female') {
    return '<i class="fa-solid fa-venus"></i>'
  }
}

function showUserModal(id){
  const userModalTItle = document.querySelector("#user-modal-title")
  const userModalImage = document.querySelector("#user-modal-image")
  const userModalInfo = document.querySelector("#user-modal-info")
  const userData = usersList.find((user)=> user.id === id)
  
  userModalImage.innerHTML = `<img src="${userData.avatar}" alt="avatar"             style="width:200px; height:200px;">`
  userModalTItle.innerText = `${userData.name} ${userData.surname}`
  userModalInfo.innerHTML=`
            <p>Gender : ${userData.gender}</p>
            <p>Age : ${userData.age}</p>
            <p>Birthday : ${userData.birthday}</p>
            <p>Region : ${userData.region}</p>
            <p>Email : ${userData.email}</p>
  `
}

dataPanel.addEventListener('click', function onAvatarClciked(event){
  if (event.target.matches('.user-avatar')){
    showUserModal(Number(event.target.dataset.id))
  }
})

axios.get(INDEX_URL).then(response => {
  usersList.push(...response.data.results)
  renderUserList(usersList)
}).catch(error => {
  console.log(error)
})