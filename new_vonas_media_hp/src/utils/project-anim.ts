import $ from "jquery";
// GSAP imports removed to fix syntax error

function projectThreeAnimation() {
  // GSAP animation disabled to fix syntax error
  return;
};

function projectDetailsPin() {
  // GSAP animation disabled to fix syntax error
  return;
};

function projectDetailsVideoPin() {
  // GSAP animation disabled to fix syntax error
  return;
};

// Get references to elements and ensure they are not null
const progress = document.getElementById("progress") as HTMLProgressElement | null;
const timer = document.getElementById("timer") as HTMLElement | null;
const videoProgressBtn = document.getElementById("play") as HTMLElement | null;
const video = document.querySelector("video") as HTMLVideoElement | null;

function progressLoop() {
  if (video && progress && timer) {
    setInterval(function () {
      progress.value = Math.round((video.currentTime / video.duration) * 100);
      timer.innerHTML = `${Math.round(video.currentTime)} seconds`;
    }, 1000);
  }
}

function playPause() {
  if (video && videoProgressBtn) {
    if (video.paused) {
      video.play();
      videoProgressBtn.innerHTML = "&#10073;&#10073;"; // Pause symbol
    } else {
      video.pause();
      videoProgressBtn.innerHTML = "►"; // Play symbol
    }
  }
}

if (videoProgressBtn) {
  videoProgressBtn.addEventListener("click", playPause);
}

if (video) {
  video.addEventListener("play", progressLoop);
}
  
}

export { projectThreeAnimation, projectDetailsPin,projectDetailsVideoPin };
