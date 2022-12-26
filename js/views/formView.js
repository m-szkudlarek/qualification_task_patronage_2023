class FormView {
  #parentElement;
  init() {
    this.#parentElement = document.querySelector(".form");
  }
  showError(element, errMsg) {
    document.querySelector(`.error--${element}`).innerText = errMsg;
    document.getElementById(`${element}`).classList.add("form__item--error");
  }
  clearError() {
    const errors = Array.from(this.#parentElement.querySelectorAll(".error"));
    errors.forEach((err) => {
      err.innerText = "";
      err.previousElementSibling.classList.remove("form__item--error");
    });
  }
  addHandlerSubmit(callback) {
    this.#parentElement?.addEventListener("submit", (e) => {
      e.preventDefault();
      setTimeout(this.clearError.bind(this), 10 * 1000);
      callback(e.target);
    });
  }
}
export default new FormView();
