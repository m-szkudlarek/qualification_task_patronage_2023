class HeaderView {
  #parentElement = document.querySelector("header");

  hideBnt(bnt) {
    bnt.classList.add("hidden");
  }
  showBnt(bnt) {
    bnt.classList.remove("hidden");
  }

  loggedView(logUser) {
    this.hideBnt(document.querySelector(".bnt--sign-in"));
    this.hideBnt(document.querySelector(".bnt--sign-up"));
    this.showBnt(document.querySelector(".bnt--sign-out"));
    this.#parentElement.classList.add("header--jc-flex-end");
    const label = document.querySelector(".header__logged");
    label.innerText = logUser.username;
    this.showBnt(label);
  }

  logOutView() {
    this.showBnt(document.querySelector(".bnt--sign-in"));
    this.showBnt(document.querySelector(".bnt--sign-up"));
    this.hideBnt(document.querySelector(".bnt--sign-out"));
    this.hideBnt(document.querySelector(".header__logged"));
    this.#parentElement.classList.remove("header--jc-flex-end");
  }
  //   handler for buttons sign in/sign up/sign out in header
  addHandlerButtons(callback) {
    this.#parentElement.addEventListener("click", function (e) {
      const clicked = e.target.closest("button");
      if (!clicked) return;
      callback(clicked);
    });
  }
}
export default new HeaderView();
