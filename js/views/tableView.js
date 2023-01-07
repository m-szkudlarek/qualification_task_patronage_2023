class TableView {
  #parentElement;
  init() {
    this.#parentElement = document.querySelector(".table");
  }
  addHandlerExpandRow(callback) {
    this.#parentElement?.addEventListener("click", (e) => {
      const clicked = e.target.closest(".table__tr--expandable");
      if (!clicked) return;
      callback(clicked);
    });
  }
}
export default new TableView();
