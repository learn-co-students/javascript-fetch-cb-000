// document.addEventListener("DOMContentLoaded", function() {
//   let link = document.querySelector('a')
//   link.addEventListener('click', function(){
//     getRepositories()
//   })
// });
//
// function getRepositories() {
//   const req = new XMLHttpRequest()
//   req.addEventListener("load", showRepositories);
//   req.open("GET", 'https://api.github.com/users/learn-co-curriculum/repos')
//   req.send()
// }
//
// function showRepositories(event, data) {
//   const repos = JSON.parse(this.responseText)
//   const repoLis = repos.map(repo => `<li> ${repo.name} </li>`).join('')
//   const repoList = `<ul> ${repoLis} </ul>`
//   document.getElementById("repositories").innerHTML = repoList
// }
