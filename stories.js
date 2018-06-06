
var stories = [
  {
    title: 'Apocolypse',
    author: 'Hayden Marquardt-Grainer',
    likes: 0,
  }
];


for(var i = 0; i < stories.length; i++) {
  document.getElementById('story-cards').innerHTML += '<div class="row"><div class="col s12 m6"><div class="card red darken-1"><div class="ca0rd-content white-text"><span class="card-title">' + stories[i].title + '</span><p>By ' + stories[i].author + '</p></div><div class="card-action"><a href="/' + stories[i].author.split(" ")[1] + '/' + stories[i].title + '">Read</a></div></div></div></div>';
}
