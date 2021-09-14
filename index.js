const progress = document.querySelectorAll('.progress');
const progressSound = document.querySelector('.progress-sound');
const progressColor = "#24809e";
const lightGray = "#b3b3b3";
 
progress.forEach(element => {
  element.addEventListener('input', function() {
    const value = this.value;
    this.style.background = `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${value}%, ${lightGray} ${value}%, white 100%)`
  });
});
progressSound.addEventListener('input', function() {
    const value = this.value;
    this.style.background = `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${value}%, ${lightGray} ${value}%, white 100%)`
  });

/* get elements */
const video=document.querySelector('video');
const playButton=document.querySelector('#play-button');
const bigPlayButton=document.querySelector('#play');
const prevButton=document.querySelector('#previous-button');
const nextButton=document.querySelector('#next-button');
const volumeButton=document.querySelector('#volume-button');
const progressBar=document.querySelector('#progress-bar');
const fullScreenButton=document.querySelector('#full-screen-button');
let srcBaseString='./assets/video/';
let videoIndex=0;
const videoSrc=['hang.mp4','carousel.mp4','rockbalance.mp4'];

/* build functions */
const promise = video.play();

if (promise !== undefined) {
  promise.then(() => {
    // Autoplay started
    video.muted = true;
    video.play();
    video.muted = false;
    video.play();
  }).catch(error => {
    // Autoplay was prevented.
    video.muted = true;
    video.play();
    video.muted = false;
    video.play();
  });
}
function togglePlay(){
  const method=video.paused?'play':'pause';
  video[method]();
}
function updateButton(){
  let background;
  if(this.paused){
    background='assets/svg/play-button.svg';
    bigPlayButton.classList.remove('fade');
  }
  else {
    background='assets/svg/pause.svg';
    bigPlayButton.classList.add('fade');
  }
  playButton.style.backgroundImage = `url(${background})`;
}
function goAhead(){
  if(videoIndex<videoSrc.length-1)
    videoIndex++;
  else videoIndex=0;
  changeVideoSrc(videoIndex);
  video.load();
  video.play();
}
function goBack(){
 if(videoIndex==0)
    videoIndex=videoSrc.length-1;
  else videoIndex--;
  changeVideoSrc(videoIndex);
  video.load();
  video.play();
}
function changeVideoSrc(index){
  video.src=`${srcBaseString}`+`${videoSrc[index]}`;
}
function handleRangeUpdate(){
  video[this.name]=this.value;
  if(this.name==='volume') changeVolume(this);
  if(this.name==='progress') handleProgress();
}
function changeVolume(e){
  const percent=e.value*100;
  progressSound.style.background = `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${percent}%, ${lightGray} ${percent}%, white 100%)`;
}
function handleProgress(){
  const percent=(video.currentTime/video.duration)*100;
  progressBar.style.background = `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${percent}%, ${lightGray} ${percent}%, white 100%)`;
  progressBar.value=percent;
}
function toggleSound(){
  if(video.muted) video.muted=false;
  else video.muted=true;
  updateSoundButton();
}
function updateSoundButton(){
  let backgroundImage;  
  if(video.muted) backgroundImage='assets/svg/mute.svg';
  else backgroundImage='assets/svg/volume-button.svg';
  volumeButton.style.backgroundImage = `url(${backgroundImage})`;
}
function scrub(e){
  const scrubTime = video.duration * (progressBar.value / 100);
  video.currentTime = scrubTime;
}
function toggleFullScreen() {
  if(video.requestFullScreen){
		video.requestFullScreen();
	} else if(video.webkitRequestFullScreen){
		video.webkitRequestFullScreen();
	} else if(video.mozRequestFullScreen){
		video.mozRequestFullScreen();
	}
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
function increase() {
  video.playbackRate += 1;
}
function decrease() {
  if (video.playbackRate > 1)
      video.playbackRate -= 1;
}
function handleKeys(e){
  if (e.keyCode === 70) {
    toggleFullScreen();
  }
  if (e.keyCode === 32 || e.keyCode === 75) {
    togglePlay();
  }
  if (e.keyCode === 77) {
    toggleSound();
  }
  if (e.keyCode === 39) {
    increase();
  }
  if (e.keyCode === 37) {
    decrease();
  }
  if (e.keyCode === 74) {
    video.currentTime +=10;
  }
  if (e.keyCode === 74) {
    video.currentTime -=10;
  }
  if (e.keyCode === 76) {
    video.currentTime +=10;
  }
  if (e.keyCode === 80 && e.shiftKey) {
    goBack();
  }
  if (e.keyCode === 78 && e.shiftKey) {
    goAhead();
  }
  if (e.keyCode === 190 && e.shiftKey) {
    increase();
  }
  if (e.keyCode === 188 && e.shiftKey) {
    decrease();
  }
}

/* hook up events */
video.addEventListener('click',togglePlay);
playButton.addEventListener('click',togglePlay);
bigPlayButton.addEventListener('click',togglePlay);
video.addEventListener('play',updateButton);
video.addEventListener('pause',updateButton);
nextButton.addEventListener('click',goAhead);
prevButton.addEventListener('click',goBack);
progressSound.addEventListener('change',handleRangeUpdate);
progressSound.addEventListener('mousemove',handleRangeUpdate);
video.addEventListener('timeupdate',handleProgress);
volumeButton.addEventListener('click',toggleSound);
let mousedown=false;
progressBar.addEventListener('change',handleRangeUpdate);
progressBar.addEventListener('click',scrub);
progressBar.addEventListener('mousemove',(e)=>mousedown && scrub(e));
progressBar.addEventListener('mousedown',()=>mousedown=true);
progressBar.addEventListener('mouseup',()=>mousedown=false);
document.addEventListener("keydown", handleKeys, false);
fullScreenButton.addEventListener('click',toggleFullScreen);
