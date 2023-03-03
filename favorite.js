const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
      <div class="col-sm-3">
            <div class="mb-2">
              <div class="card">
                <img
                  src="${POSTER_URL + item.image}"
                  class="card-img-top" alt="Movie Poster" />
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                </div>
                <div class="card-footer">
                  <!-- 修改這裡 -->
                  <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">
                    More
                  </button>
                  <button class="btn btn-danger btn-delete" data-id="${item.id}">X</button>
                </div>
              </div>
            </div>
          </div>`
  });
  dataPanel.innerHTML = rawHTML
}

renderMovieList(list)

dataPanel.addEventListener('click', function onClickPanel(event) {
  const target = event.target
  if (event.target.matches('.btn-show-movie')) {
    axios
      .get(INDEX_URL + `${target.dataset.id}`)
      .then((response) => {
        document.querySelector('#movie-modal-title').innerText = response.data.results.title
        document.querySelector('#movie-modal-date').innerText = `Release date : ${response.data.results.release_date}`
        document.querySelector('#movie-modal-description').innerText = response.data.results.description
        document.querySelector('#movie-modal-image').innerHTML = `<img src="https://webdev.alphacamp.io/posters/${response.data.results.image}" alt="movie-poster" class="img-fluid">`
        // document.querySelector('#movie-modal-description').innerText = response.data.results.title

        console.log(response.data.results)
      })
      .catch((error) => {
        console.log('error')
      })
  } else if (event.target.matches('.btn-delete')) {
    // 如果忘了 + Number那你就去死
    deleteOnFavorite(Number(event.target.dataset.id))
  }
})

// 從最愛刪除電影功能
function deleteOnFavorite(id) {
  // 點擊後取得的電影id轉為實際資料
  const movieIndex = list.findIndex((movie) => movie.id === id)
  // 從list找符合的項目並刪去
  console.log(movieIndex)
  list.splice(movieIndex, 1)
  // 將剛新增的電影存入localStorage
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  renderMovieList(list)
}