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

  addHandlerFilter(callback) {
    this.#parentElement
      ?.querySelector("#table__filtr")
      .addEventListener("change", function () {
        callback(this.value);
      });
  }

  addHandlerSearch(callback) {
    this.#parentElement
      ?.querySelector(".table__search--container")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const searched = new FormData(e.target);
        if (!searched) return;
        callback(searched.get("table__search--input"));
      });
  }

  updateTableView(newMarkup) {
    // update method works like generate but you dont insert to DOM imidiatly
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // elements can change are only tr in tbody rest stay the same
    const newElements = Array.from(newDOM.querySelectorAll("tr"));
    const tbody = this.#parentElement.querySelector("tbody");

    // empty old table
    tbody.replaceChildren();
    // put new data in table
    newElements.forEach((newEl) => {
      if (newEl.parentElement.tagName === "TBODY") tbody.appendChild(newEl);
    });
  }
}
export default new TableView();
