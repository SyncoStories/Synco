
var stories = [
  {
    title: 'Apocalypse',
    author: 'Hayden Marquardt-Grainer',
    likes: 0,
  }
];


for(var i = 0; i < stories.length; i++) {
  document.getElementById('story-cards').innerHTML += '<div class="card" onclick="window.location.href = \'' + stories[i].author.split(" ")[1] + '/' + stories[i].title + '\'"><span class="card-title">' + stories[i].title + '</span><p>By ' + stories[i].author + '</p></div>';
}
