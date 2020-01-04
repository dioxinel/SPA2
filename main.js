let baseURL = 'https://api.themoviedb.org/3/';
let APIKEY = '';  // Enter your apikey
let baseImageURL = "https://image.tmdb.org/t/p/";
let posterSize = 'w185';


let getMainList = function (num) {
  if (typeof(num) == 'object'){
    num = 1; 
  }
  if(output){
  output.remove();
  }
  let mainPartUrl;
  if(window.location.hash == '#topRated'){
    mainPartUrl = 'tv/top_rated?api_key=';
  }
  else{
    mainPartUrl = 'tv/popular?api_key=';
  }

  let url = "".concat(baseURL, mainPartUrl, APIKEY, '&language=en-US&page=', num);
  fetch(url)
  .then(result=>result.json())
  .then((data)=>{
    let smth = document.createElement('div');
    smth.id = 'output';
    page.append(smth);
    for (let show in data.results) {
      createTitle(show, data, output);
    }
    let lastp = data.total_pages;
    updatePagin(lastp, num);
  })
}


let createTitle = function (show, data, outputObj) {
  let Name = data.results[show].name;
  let TV_Show = document.createElement('li');
  let TV = document.createElement('a');
  TV.innerHTML = Name;
  TV.data = data;
  TV.show = show;
  TV.addEventListener('click', discription);
  TV_Show.append(TV);
  //TV_Show.append(createDiscription(Name, show, data));
  outputObj.append(TV_Show);
}


let discription = function() {
  output.remove();
  let smth = document.createElement('div');
  smth.id = 'output';
  page.append(smth);
  let discrip = document.createElement('div');
  let name = document.createElement('div');
  name.innerHTML = this.innerHTML;
  discrip.append(name);
  discrip.append(displayPoster(this.show, this.data));
  discrip.append(displayOverview(this.show, this.data));
  let tvId = this.data.results[this.show].id;
  let url = "".concat(baseURL, 'tv/', tvId, 'popular?api_key=', APIKEY, '&language=en-US');
  fetch(url)
    .then(result=>result.json())
    .then((data)=>{
      discrip.append(displayNumberOfSeasons(data));
      discrip.append(displayNumberOfEpisodes(data));
      discrip.append(displayListOfSeasons(data));
    })
  output.append(discrip);
}


let displayOverview = function (show, data) {
  let overviewShow = document.createElement('p');
  let overview = data.results[show].overview;
  overviewShow.innerHTML = overview;
  return overviewShow;
  }


let displayPoster = function (show, data, name) {
  let posterShow = document.createElement('img');
  posterShow.alt = 'Постер відсутній';
  let posterPath = data.results[show].poster_path;
  if (posterPath == null) {
    return;
  }
  posterShow.src = "".concat(baseImageURL, posterSize, posterPath);
  return posterShow;
  }


let displayNumberOfSeasons = function (data) {
  let numberOfSeasons = document.createElement('p');
  let len = data.number_of_seasons;
  numberOfSeasons.innerHTML = 'Number of seasons: ' + len;
  return numberOfSeasons;
}


let displayNumberOfEpisodes = function (data) {
  let numberOfEpisodes = document.createElement('p');
  let len = data.number_of_episodes;
  numberOfEpisodes.innerHTML = 'Number of episodes: ' + len;
  return numberOfEpisodes;
}
 

let displayListOfSeasons = function (data) {
  let listOfSeasons = document.createElement('div');
  let len = data.number_of_seasons;
  for (let i = 0; i < len; i++) {
    let nameOfSeason = data.seasons[i].name;
    let season = document.createElement('li');
    let seasonName = document.createElement('a');
    season.data = data;
    season.numOfSeason = i;
    season.addEventListener('click', seasonDiscription);
    seasonName.innerHTML = nameOfSeason;
    season.append(seasonName);
    listOfSeasons.append(season);
    
  } 
  return listOfSeasons;
}


let seasonDiscription = function() {
  output.remove();
  let smth = document.createElement('div');
  smth.id = 'output';
  page.append(smth);
  let discrip = document.createElement('div');
  let name = document.createElement('div');
  name.innerHTML = this.data.name;
  discrip.append(name);
  let numOfSeason = document.createElement('div');
  numOfSeason.innerHTML = 'Number of season: ' + this.numOfSeason;
  discrip.append(numOfSeason);
  discrip.append(seasonPoster(this.data, this.numOfSeason));
  discrip.append(seasonOveriew(this.data, this.numOfSeason));
  discrip.append(numOfEpisodesInSeason(this.data, this.numOfSeason));
  discrip.append(listOfEpisodes(this.data, this.numOfSeason, seasonPoster(this.data, this.numOfSeason)));
  output.append(discrip);
  }


let seasonPoster = function(data, numOfSeason) {
  let posterOfSeason = document.createElement('img');
  posterOfSeason.alt = 'Постер відсутній';
  let posterPath = data.seasons[numOfSeason].poster_path;
  if (posterPath == null) {
    return;
  }
  posterOfSeason.src = "".concat(baseImageURL, posterSize, posterPath);
  return posterOfSeason;
  }


 let seasonOveriew = function(data, numOfSeason){
  let overviewOfSeason = document.createElement('p');
  let overview = data.seasons[numOfSeason].overview;
  overviewOfSeason.innerHTML = overview;
  return overviewOfSeason;
 }


 let numOfEpisodesInSeason = function(data, numOfSeason) {
  let numberOfEpisodes = document.createElement('p');
  let len = data.seasons[numOfSeason].episode_count;
  numberOfEpisodes.innerHTML = 'Number of episodes: ' + len;
  return numberOfEpisodes;
 }


let listOfEpisodes = function(data, numOfSeason, seasonPoster){
  let episodesList = document.createElement('div');
  for (let i = 1; i < data.seasons[numOfSeason].episode_count + 1; i++){
    let episode = document.createElement('li');
    let episodeName = document.createElement('a');
    episodeName.num = i;
    episodeName.numOfSeason = numOfSeason;
    episodeName.data = data;
    episodeName.poster = seasonPoster;
    episodeName.addEventListener('click', episodeDiscriprion);
    episodeName.innerHTML = 'Episode: ' + i;
    episode.append(episodeName);
    episodesList.append(episode);
  }
  return episodesList;
}

let episodeDiscriprion = function() {
  output.remove();
  let smth = document.createElement('div');
  smth.id = 'output';
  page.append(smth);
  let showName = document.createElement('div');
  name = this.data.name;
  showName.innerHTML = name;
  output.append(showName);
  output.append(this.poster);
  let id = this.data.id;
  let numS = this.numOfSeason;
  if (numS == 0) {
    numS = 1;
  }
  let numE = this.num;
  let url = "".concat(baseURL, 'tv/', id, '/season/', numS, '/episode/', numE,  '?api_key=', APIKEY, '&language=en-US');
  fetch(url)
  .then(result=>result.json())
  .then((data)=>{
    let overview = document.createElement('div');
    overview.innerHTML = data.overview;
    output.append(overview);
    let episodeNum = document.createElement('div');
    let seasonNum = document.createElement('div');
    episodeNum.innerHTML = 'Number of episode: ' + data.episode_number;
    seasonNum.innerHTML = 'Number of season: ' + data.season_number;
    output.append(episodeNum, seasonNum);
  })

}


let createPaginNode = function (num, place) {
  let p = document.createElement('a');
  p.num = num;
  p.innerHTML = num;
  p.addEventListener('click', pagin);
  place.append(p);
}


let pagin = function () {
  let center = this.num;
  getMainList(center);
}


let updatePagin = function (lastp, center) {
  if(pagination) {
    pagination.remove();
  }
  let full = document.createElement('div');
  full.id = 'pagination';
  let before = document.createElement('div');
  before.id = 'beforeMain';
  let main = document.createElement('div');
  main.id = 'mainPart';
  let after = document.createElement('div');
  after.id = 'afterMain';
  full. append(before);
  full. append(main);
  full. append(after);
  body.append(full);
  let copyCenter = center;
  if (center < 3) {
    center = 3;
  }
  else if (center > lastp - 3) {
    center = lastp - 2;
  }

  if(!(copyCenter > lastp - 3)) {
    let threep = document.createTextNode('...');
    afterMain.append(threep);
    createPaginNode(lastp, afterMain);
  }
  if(!(copyCenter < 3)){
    createPaginNode(1, beforeMain);
    let threep = document.createTextNode('...');
    beforeMain.append(threep);
  }

  for (let i = center - 2; i < center + 3; i++){
  createPaginNode(i, mainPart);
  }
}


// document.addEventListener('DOMContentLoaded', getConfig);
document.addEventListener('DOMContentLoaded', getMainList);
window.addEventListener('hashchange', getMainList);
mainPage.addEventListener('click', getMainList);

 // To get image config
  // let getConfig = function () {
  //   let url = "".concat(baseURL, 'configuration?api_key=', APIKEY);
  //   fetch(url)
  //     .then((result)=>{
  //       return result.json();
  //       })
  //     .then((data)=>{
  //       baseImageURL = data.images.secure_base_url;
  //       configData = data.images;
  //       console.log(configData);
  //       })
  //   }
