const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let resultMovies = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const movies_per_page = 4
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderMovieList(getMoviesByPage(1))
    createPages(movies.length)
  })
  .catch((err) => console.log(err))
//渲染電影清單
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    if(item.title.length > 10){
      item.title = item.title.slice(0, 7) + '...'
    }
    console.log(item.title.length)
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
                  <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                </div>
              </div>
            </div>
          </div>`
  });
  dataPanel.innerHTML = rawHTML
}
//點擊出現電影介紹
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
  } else if (event.target.matches('.btn-add-favorite')) {
    // 如果忘了 + Number那你就去死
    addToFavorite(Number(event.target.dataset.id))
  }
})
// 新增至最愛的功能
function addToFavorite(id) {
  // 先建立一個清單將既有的localStorage的資料做轉換
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  // 點擊後取得的電影id轉為實際資料
  const movie = movies.find((movie) => movie.id === id)
  // 若資料重複則不再儲存
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已存在最愛清單中")
  }
  // 無重複就加進list
  list.push(movie)
  // 將剛新增的電影存入localStorage
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}
//搜尋結果
searchForm.addEventListener('submit', function onClickSubmitted(e) {
  e.preventDefault()
  // 清空關鍵字
  resultMovies = []
  // trim做為去頭尾，優化搜尋，toLowerCase為全部改成小寫，replace(/\s+/g, "")去除所有空格
  const keyword = searchInput.value.trim().toLowerCase().replace(/\s+/g, "")
  // 檢查關鍵字是否為空值
  if (!keyword.length) {
    console.log('yes')
  }
  // 把符合關鍵字的movie加入resultMovies
  movies.forEach(movie => {
    // .replace(/[-]/g, "")去除所有分號
    const clearMovieTitle = movie.title.trim().toLowerCase().replace(/\s+/g, "").replace(/[-]/g, "")
    if (clearMovieTitle.includes(keyword)) {
      resultMovies.push(movie)
    }
  })
  // 回傳未找到合適電影
  if (resultMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  createPages(resultMovies.length)
  renderMovieList(getMoviesByPage(1))
})
// 切割movies陣列到每個分頁
function getMoviesByPage(page) {
  const data = resultMovies.length ? resultMovies : movies
  const startIndex = (page - 1) * movies_per_page
  return data.slice(startIndex, startIndex + movies_per_page)
}
// 製作分頁
function createPages(amount) {
  const numberOfPages = Math.ceil(amount / movies_per_page)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-id="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}
// 按下分頁器後的行為
paginator.addEventListener('click', function onClickPage(event) {
  if (event.target.tagName !== 'A') {
    return
  } else {
    renderMovieList(getMoviesByPage(Number(event.target.dataset.id)))
  }
})