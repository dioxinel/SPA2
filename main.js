let baseURL = 'https://api.themoviedb.org/3/';
let APIKEY = '';  // Enter your apikey, you can get apikey here: 'https://www.themoviedb.org/'
let baseImageURL = "https://image.tmdb.org/t/p/";
let posterSize = 'w185';


let getMainList = function(num) {

  if (typeof(num) == 'object'){
    num = 1; 
  }  

  let mainPartUrl;

  if(window.location.hash == '#topRated'){
    mainPartUrl = 'tv/top_rated?api_key=';
  }else{
    mainPartUrl = 'tv/popular?api_key=';
  }

  let url = "".concat(baseURL, mainPartUrl, APIKEY, '&language=en-US&page=', num);
  fetch(url)
  .then(result=>result.json())
  .then((data)=>{
    refreshOutput();

    for (let show in data.results) {
      createTitle(show, data, output);
    }

    let lastp = data.total_pages;
    updatePagin(lastp, num);
  })
}


let refreshOutput = function() {
  output.remove();
    let smth = document.createElement('div');
    smth.id = 'output';
    page.append(smth);
}


let createTitle = function(show, data, outputObj) {
  let dataName = data.results[show];
  let TV_Show = displayName(dataName);
  TV = TV_Show.lastChild;
  TV.data = data;
  TV.show = show;
  TV.addEventListener('click', discription);
  
  outputObj.append(TV_Show);
}


let displayName = function(data) {
  let name = data.name;
  let object = document.createElement('div');
  let objectName = document.createElement('a');
  objectName.innerHTML = name;
  object.append(objectName);
  return object;
}


let discription = function() {

  refreshOutput();
  pagination.style.display = 'none';

  let discrip = document.createElement('div');
  let name = document.createElement('div');
  name.innerHTML = this.innerHTML;
  discrip.append(name);
  discrip.append(displayPoster(this.data.results[this.show]));
  discrip.append(displayOverview(this.data.results[this.show]));
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


let displayOverview = function(data) {
  let overviewObj = document.createElement('p');
  let overview = data.overview;
  overviewObj.innerHTML = overview;
  return overviewObj;
}


let displayPoster = function(data) {
  let posterShow = document.createElement('img');
  posterShow.alt = 'Постер відсутній';
  let posterPath = data.poster_path;
  if (!(posterPath == null)) {
    this.posterPath = posterPath;
  }else{
    posterPath = this.posterPath; // If not season's poster as a poster will used show's poster
  }

  posterShow.src = "".concat(baseImageURL, posterSize, posterPath);
  return posterShow;
}


let displayNumberOfSeasons = function(data) {
  let numberOfSeasons = document.createElement('p');
  let len = data.number_of_seasons;
  numberOfSeasons.innerHTML = 'Number of seasons: ' + len;
  return numberOfSeasons;
}


let displayNumberOfEpisodes = function(data) {
  let numberOfEpisodes = document.createElement('p');
  let len = data.number_of_episodes;
  numberOfEpisodes.innerHTML = 'Number of episodes: ' + len;
  return numberOfEpisodes;
}
 

let displayListOfSeasons = function(data) {
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
  
  refreshOutput();

  let discrip = document.createElement('div');

  discrip.append(displayName(this.data));

  let numOfSeason = document.createElement('div');
  numOfSeason.innerHTML = 'Number of season: ' + this.numOfSeason;
  discrip.append(numOfSeason);
  discrip.append(displayPoster(this.data.seasons[this.numOfSeason]));
  discrip.append(displayOverview(this.data.seasons[this.numOfSeason]));
  discrip.append(numOfEpisodesInSeason(this.data, this.numOfSeason));
  discrip.append(listOfEpisodes(this.data, this.numOfSeason, displayPoster(this.data.seasons[this.numOfSeason])));
  output.append(discrip);
}


let numOfEpisodesInSeason = function(data, numOfSeason) {
  let numberOfEpisodes = document.createElement('p');
  let len = data.seasons[numOfSeason].episode_count;
  numberOfEpisodes.innerHTML = 'Number of episodes: ' + len;
  return numberOfEpisodes;
}


let listOfEpisodes = function(data, numOfSeason, seasonPoster) {
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
  
  refreshOutput();
 
  output.append(displayName(this.data));
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
    output.append(displayOverview(data));
    let episodeNum = document.createElement('div');
    let seasonNum = document.createElement('div');
    episodeNum.innerHTML = 'Number of episode: ' + data.episode_number;
    seasonNum.innerHTML = 'Number of season: ' + data.season_number;
    output.append(episodeNum, seasonNum);
  })
}


let createPaginNode = function(num, place) {
  let p = document.createElement('a');
  p.num = num;
  p.innerHTML = num;
  p.addEventListener('click', pagin);
  place.append(p);
}


let pagin = function() {
  let center = this.num;
  getMainList(center);
}


let updatePagin = function(lastp, center) {

  if(pagination) {
    pagination.remove();
  }
  
  let full = document.createElement('div');
  full.id = 'pagination';

  let before = document.createElement('div');
  before.id = 'beforeMain';
  full.append(before);
  
  let main = document.createElement('div');
  main.id = 'mainPart';
  full.append(main);
  
  let after = document.createElement('div');
  after.id = 'afterMain';
  full. append(after);
  body.append(full);

  let copyCenter = center;

  if (center < 3) {
    center = 3;
  }else if (center > lastp - 3) {
    center = lastp - 2;
  }

  if(!(copyCenter > lastp - 3)) {
    let threep = document.createTextNode('...');
    afterMain.append(threep);
    createPaginNode(lastp, afterMain);
  }

  if(!(copyCenter < 3)) {
    createPaginNode(1, beforeMain);
    let threep = document.createTextNode('...');
    beforeMain.append(threep);
  }

  for (let i = center - 2; i < center + 3; i++) {
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
