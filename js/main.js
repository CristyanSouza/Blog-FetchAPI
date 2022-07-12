const url = 'https://jsonplaceholder.typicode.com/posts'

//Get elements
const loadingElement = document.querySelector('#loading')
const postsContainer = document.querySelector('#posts-container')

const postPage = document.querySelector("#post")
const postContainer = document.querySelector("#post-container")
const commentsContainer = document.querySelector("#comments-container")

const commentForm = document.querySelector("#comment-form")
const emailInput = document.querySelector("#email")
const bodyInput = document.querySelector("#body")

//Get ID
const urlSearchParams = new URLSearchParams(window.location.search)
const postId = urlSearchParams.get('id')

//Get all posts
async function getAllPosts() {
  const response = await fetch(url)

  const data = await response.json()

  loadingElement.classList.add('hide')

  data.map(post => {
    const div = document.createElement('div')
    const title = document.createElement('h2')
    const body = document.createElement('p')
    const link = document.createElement('a')

    title.innerText = post.title
    body.innerText = post.body
    link.innerText = 'Ler'
    link.setAttribute("href", `post.html?id=${post.id}`)

    div.appendChild(title)
    div.appendChild(body)
    div.appendChild(link)

    postsContainer.appendChild(div)
  })
}
// Create new comment
function createComment (comment) {
  const commentDiv = document.createElement("div")
  const userEmail = document.createElement("h3")
  const commentText = document.createElement("p")

   userEmail.innerText = comment.email
    commentText.innerText = comment.body

    commentDiv.appendChild(userEmail)
    commentDiv.appendChild(commentText)
    commentsContainer.appendChild(commentDiv)
}

//Post new comment
async function postComment(comment){
  const response = await fetch(`${url}/${postId}/comments`, {
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/json"
    }
  })

  const data = await response.json()

  createComment(data)
}

// Get individual post
async function getPost(id){
  const[responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`)  
  ])

  const dataPost = await responsePost.json()
  const dataComments = await responseComments.json()

  loadingElement.classList.add('hide');
  postPage.classList.remove('hide');

  const title = document.createElement('h1')
  const body = document.createElement('p')

  title.innerText = dataPost.title
  body.innerText = dataPost.body

  postContainer.appendChild(title)
  postContainer.appendChild(body)

  dataComments.map((comment) => {
      createComment(comment)
  })
}




if (!postId) {
  getAllPosts()
} else {
  getPost(postId)

  //Comment form event

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let comment = {
      email: emailInput.value,
      body: bodyInput.value
    }
    comment = JSON.stringify(comment)

    postComment(comment)

    emailInput.value = ""
    bodyInput.value = ""
  })
}
