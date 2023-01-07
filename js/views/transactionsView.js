class TransactionsView {
  #parentElement;
  init() {
    this.#parentElement = document.querySelector(".transactions");
  }
  addHandlerSubmit(callback) {
    this.#parentElement?.addEventListener("submit", (e) => {
      e.preventDefault();
      setTimeout(this.clearError.bind(this), 10 * 1000);
      callback(e.target);
    });
  }
}
export default new TransactionsView();
