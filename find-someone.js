const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const USERS_PER_PAGE = 10

let usersList = []

const dataPanel = document.querySelector('#data-panel')

function renderUserList(users) {
  let rawHTML = ''
  for (let user of users) {
    rawHTML += `<div class="card mt-3 pt-3 d-flex align-items-center shadow p-3 mb-5 bg-body rounded" style="width: 14rem;">
        <a href=""><img src="${user.avatar}"
            class="card-img-top user-avatar border rounded-circle shadow-sm bg-body rounded" alt="avatar"
            style="width:150px; height:150px;"
            data-id="${user.id}"></a>
        <div class="card-body">
          <h5 class="text-center"><i class="fa-solid fa-venus"></i> ${user.name} ${user.surname}</h5>
          <h6 class="text-center">Age : ${user.age}</h6>
          <h6 class="text-center">Region : ${user.region}</h6>
        </div>
      </div>`
  }

  dataPanel.innerHTML = rawHTML
}

axios.get(INDEX_URL).then(response => {
  usersList.push(...response.data.results)
  renderUserList(usersList)
}).catch(error => {
  console.log(error)
})