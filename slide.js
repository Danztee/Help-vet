const slides = document.querySelectorAll(".slider");

const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

const dotContainer = document.querySelector(".dots");

let curSlide = 0;
const maxSlide = slides.length;
let isDragging = false;
startPos = 0;
currentTranslate = 0;
prevTranslate = 0;
currentindex = 0;

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

  // touch events
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("touchmove", touchMove);
});

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function touchStart(index) {
  return function (event) {
    currentindex = index;
    startPos = getPositionX(event);
    isDragging = true;
  };
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function touchEnd() {
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;
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
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
}

const init = function () {
  //   goToSlide(0);
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
    activateDot(slide);
  }
});

slides.forEach(function (slide) {
  slide.addEventListener("touchstart", goToSlide);
});

// Set up events
// var slider = document.querySelector(".slider")[0];

// slides.forEach(slid, () => {});

// slides.addEventListener("touchmove", goToSlide, false);

// if (xDiff > 0) {
//   /* left swipe */
//   slideRight();
// } else {
//   /* right swipe */
//   slideLeft();
// }

// slides.forEach(function (slide, index) {
//   slide.addEventListener("touchstart", goToSlide, false);
// });
