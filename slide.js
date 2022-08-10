const slides = document.querySelectorAll(".slider");
const dotContainer = document.querySelector(".dots");
const sliderContainer = Array.from(document.querySelectorAll("#container"));

let curSlide = 0;
const maxSlide = slides.length;

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID,
  currentIndex = 0;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

slides.forEach(function (slide, index) {
  slide.style.left = `${index * 100}%`;
});

slides.forEach(function (slide, index) {
  const slideImage = slide.querySelector("img");
  slideImage.addEventListener("dragstart", (e) => e.preventDefault());

  // touch events
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("touchmove", touchMove);

  // mouse events
  // slide.addEventListener("mousedown", touchStart(index));
  // slide.addEventListener("mouseup", touchEnd);
  // slide.addEventListener("mouseleave", touchEnd);
  // slide.addEventListener("mousemove", touchMove);
});

// disable context menu
window.oncontextmenu = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function touchStart(index) {
  return function (event) {
    currentIndex = index;
    startPos = getPositionX(event);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
  };
}

function animation() {
  sliderContainer.map((each) => {
    each.style.transform = `translateX(${currentTranslate}px)`;
    if (isDragging) requestAnimationFrame(animation);
  });
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;
  setPositionByIndex();
  // sliderContainer.classList.remove("grabbing");
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  curSlide = currentIndex;
  goToSlide(curSlide);
  activateDot(curSlide);
}

const goToSlide = function () {
  slides.forEach((slide) => {
    slide.style.transform = `translateX(-${curSlide * 100}%)`;
  });
};

// next slide
function nextSlide() {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
}

// prev slide
function prevSlide() {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
}

const init = function () {
  // goToSlide(0);
  createDots();
  activateDot(0);
};

init();

// event handlers
dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    let { slide } = e.target.dataset;
    slide = +slide;
    curSlide = slide;
    goToSlide(curSlide);
    activateDot(curSlide);
  }
});

function autoSlide() {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else curSlide++;

  goToSlide(curSlide);
  activateDot(curSlide);
}

// setInterval(autoSlide, 5000);
