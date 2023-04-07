const numberOfRepositories = 5

// создать контейнер, для центрирования
const container = document.createElement('div');
container.classList.add('container');

// создать блок для верхней части: формы и 5 пунктов для выбора
const search = document.createElement('article')
search.classList.add('search');
container.appendChild(search);

const searchForm = document.createElement('form')
searchForm.classList.add('form');
search.appendChild(searchForm);

const formInput = document.createElement('input')
formInput.setAttribute('type', 'search');
formInput.setAttribute('placeholder', 'search...');
formInput.classList.add('form__input')
searchForm.appendChild(formInput);

const ul = document.createElement('ul')
ul.classList.add('list')
for (let i = 0; i < numberOfRepositories; i++) {
  const li = document.createElement('li')
  li.classList.add('list__item')
  ul.appendChild(li)
}
search.appendChild(ul);

// создать блок для списка репозиториев
const repositories = document.createElement('ul')
repositories.classList.add('repo')
container.appendChild(repositories);

// добавить разметку в контейнер
document.body.insertAdjacentElement('afterbegin', container);


// debounce 

const debounce = (fn, debounceTime) => {
  let timer
  return function(){
    const func = () => {fn.apply(this, arguments)}
    clearTimeout(timer)
    timer = setTimeout(func, debounceTime)
  }
};

// запрос
function searchRepositories(e) {
  if (e.target.value == '') {
    document.querySelectorAll(".list__item").forEach(item => item.style.display = 'none')
  } else {
    fetch(
      `https://api.github.com/search/repositories?q=${e.target.value}+in:name&sort=stars&order=desc&per_page=5`
    )
    .then((res) => res.json())
    .then((res) => {
      if (res.items.length === 0) return
      const listItems = document.querySelectorAll(".list__item")
      listItems.forEach((item) => {
        item.textContent = ''
        item.style.display = 'none'
        delete item.dataset.owner
        delete item.dataset.stars
      })
      for (let i = 0; i < res.items.length; i++) {
        listItems[i].textContent = res.items[i].name
        listItems[i].style.display = 'block'
        listItems[i].dataset.owner = res.items[i].owner.login
        listItems[i].dataset.stars = res.items[i].stargazers_count
      }
    })
    .catch(err => console.log(err))
  }
}

searchRepositories = debounce(searchRepositories, 300)

formInput.addEventListener("input", (e) => {
  searchRepositories(e)
});

// убираем список, если нажат крестик в поиске
formInput.addEventListener('search', function(e) {
  document.querySelectorAll(".list__item").forEach(item => item.style.display = 'none')
})

// добавить репозиторий в список
document.querySelector(".list").addEventListener('click', (e) => {
  if (e.target.tagName === "LI") {
    const repoItem = document.createElement("li")
    repoItem.classList.add("repo__item")
    const info = document.createElement("div")
    const name = document.createElement("p")
    name.textContent = 'Name: ' + e.target.textContent
    const owner = document.createElement("p")
    owner.textContent = 'Owner: ' + e.target.dataset.owner
    const stars = document.createElement("p")
    stars.textContent = 'Stars: ' + e.target.dataset.stars
    info.appendChild(name)
    info.appendChild(owner)
    info.appendChild(stars)
    const button = document.createElement("button")
    button.classList.add('repo__delete-btn')
    button.textContent = '\u2716'
    repoItem.appendChild(info)
    repoItem.appendChild(button)
    repositories.prepend(repoItem)

    formInput.value = ''
    document.querySelectorAll(".list__item").forEach(item => item.style.display = 'none')
  }
})

// удалить репозиторий из списка
document.querySelector('.repo').addEventListener('click', (e) => {
  if (e.target.tagName === "BUTTON"){
    e.target.parentNode.remove()
  }
})