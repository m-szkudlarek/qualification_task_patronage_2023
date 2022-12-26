class MainView {
  #parentElement = document.querySelector(".main");

  //   generate markup html for both forms
  generateHtmlForm(whichOne) {
    // first part of form this always has to render
    const markupPartOne = `<form class="form ${whichOne}">
    <label for="username" class="form__item">Nazwa użytkownika:</label>
    <div>
      <input
        id="username"
        type="text"
        class="form__item"
        name="username"
      />
      <p class="error error--username"></p>
    </div>
    <label for="password" class="form__item">Hasło:</label>
    <div>
      <input
        id="password"
        type="password"
        class="form__item"
        name="password"
      />
      <p class="error error--password"></p>
    </div>`;

    const markupPartTwo =
      whichOne === "form--sign-up"
        ? `<label for="email" class="form__item">Email:</label>
    <div>
      <input id="email" type="text" class="form__item" name="email" />
      <p class="error error--email"></p>
    </div>
    <label for="emailConfirm" class="form__item">Potwierdż email:</label>
    <div>
      <input
        id="emailConfirm"
        type="text"
        class="form__item"
        name="emailConfirm"
      />
      <p class="error error--emailConfirm"></p>
    </div>
    <button type="submit" class="form__item bnt form__item--sign-up">
      zarejestruj się
    </button>
  </form>`
        : `<button type="submit" class="form__item bnt form__item--sign-in">
        zaloguj się
      </button>
    </form>`;

    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML(
      "afterbegin",
      markupPartOne + markupPartTwo
    );
  }

  generateHtmlLoggedView() {
    const markup = ``;
    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  generateHtmlLogOut() {
    this.#parentElement.innerHTML = "";
  }
}

export default new MainView();
