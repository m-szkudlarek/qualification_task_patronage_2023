class CarouselView {
  #parentElement;
  #slides;
  #initialPosition = 0;
  #currentSlide;
  init() {
    this.#parentElement = document.querySelector(".carousel");
    this.#slides = Array.from(
      this.#parentElement.querySelectorAll(".carousel__slide")
    );
    this.#slides[0].classList.add("current-slide");
    this.getCarouselNav().firstElementChild.classList.add("current-dot");
    this.#currentSlide = this.#slides[0];
  }

  setInitialPosition(value) {
    this.#initialPosition = value;
  }
  getInitialPosition() {
    return this.#initialPosition;
  }

  getSlideAt(index) {
    return this.#slides[index];
  }
  getCurrentSlide() {
    return this.#currentSlide;
  }
  getCarouselNav() {
    return this.#parentElement.parentElement.querySelector(".carousel__nav");
  }
  setPositionSlides() {
    this.#slides.forEach((slide, index) => {
      slide.style.right = `-${index * 100}%`;
    });
  }

  updateDots(currentDot, targetDot) {
    if (!targetDot) return;
    currentDot.classList.remove("current-dot");
    targetDot.classList.add("current-dot");
  }
  moveToSlide(targetSlide) {
    if (!targetSlide) return;
    const amountToMove = targetSlide.style.right;

    this.#parentElement.querySelector(
      "ul"
    ).style.transform = `translateX(${amountToMove})`;

    this.#currentSlide.classList.remove("active");
    targetSlide.classList.add("active");

    this.#currentSlide = targetSlide;
  }

  prevSlide() {
    const prevSlide = this.#currentSlide.previousElementSibling;
    const currentDot = this.getCarouselNav().querySelector(".current-dot");
    const prevDot = currentDot.previousElementSibling;
    this.moveToSlide(prevSlide);
    this.updateDots(currentDot, prevDot);
  }
  nextSlide() {
    const nextSlide = this.#currentSlide.nextElementSibling;
    const currentDot = this.getCarouselNav().querySelector(".current-dot");
    const nextDot = currentDot.nextElementSibling;
    this.moveToSlide(nextSlide);
    this.updateDots(currentDot, nextDot);
  }

  addHandlerPointerDown(callback) {
    this.#parentElement.addEventListener("pointerdown", callback);
  }
  addHandlerPointerUp(callback) {
    this.#parentElement.addEventListener("pointerup", callback);
  }
  addHandlerClickedDot(callback) {
    this.getCarouselNav().addEventListener("click", callback);
  }
}

export default new CarouselView();
