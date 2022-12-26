export const state = {
  canRegister: true,
  loggedIn: { logged: false }, //logged user
  allRegistered: [], //all users
};

export const registerUser = function (user) {
  user.password = hashFunction(user.password);
  state.allRegistered.push(user);
  Object.assign(state.loggedIn, user);
  state.loggedIn.logged = true;
  setSessionStorage();
};

export const logOutUser = function () {
  state.loggedIn = { logged: false };
  setSessionStorage();
};

export const validUsername = function (username) {
  // non empty field
  if (!username.length) throwErrorMSg("username", "Pole nie może byc puste");
  if (
    !(
      (
        /[\w\[\]\\\/]{6,16}/g.test(username) && //regex for 6 to 16 chars
        /([\w\[\]\\\/]*\D[\w\[\]\\\/]*){5,}/g.test(username) && // regex for over 5 letters
        /\d+/g.test(username)
      ) // regex for 1 digit
    )
  )
    throwErrorMSg(
      "username",
      "Nazwa użytkownika musi zawierać od 6 do 16 znaków(w tym przynajmniej 5 liter i 1 cyfrę)"
    );

  if (state.allRegistered.some((acc) => acc.username === username))
    throwErrorMSg("username", "Taki użytkownik już posiada konto");
};

export const validPassword = function (password) {
  // non empty field
  if (!password.length) throwErrorMSg("password", "Pole nie może byc puste");
  if (password.length < 6)
    throwErrorMSg("password", "Hasło powinno zawierać przynajmniej 6 znaków");
};

export const validEmail = function (email) {
  // non empty field
  if (!email.length) throwErrorMSg("email", "Pole nie może byc puste");
  // regular expresion standard RFC 2822
  const regEx =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (!regEx.test(email)) throwErrorMSg("email", "Niepoprawny format email");

  // get the main adress email and search for aliases in gmail standard
  const matches = /(.*)@/g.exec(email);
  if (!matches) return;
  const adres = new RegExp(matches[1] + "+", "g");
  if (state.allRegistered.some((acc) => adres.test(acc.email)))
    throwErrorMSg("email", "Email jest już w użyciu");
};

export const validEmailConfirm = function (email, emailConfirm) {
  // non empty field
  if (!emailConfirm.length)
    throwErrorMSg("emailConfirm", "Pole nie może byc puste");
  if (!(email === emailConfirm))
    throwErrorMSg("emailConfirm", "Podany email'e nie pasują do siebie");
};
// creat new Error ,using the .name property to display the error on the appropriate field
const throwErrorMSg = function (name, msg) {
  const err = new Error(msg);
  err.name = name;
  throw err;
};

export const validLogin = function (username, password) {
  if (!username.length) throwErrorMSg("username", "Pole nie może byc puste");
  if (!password.length) throwErrorMSg("password", "Pole nie może byc puste");

  // get user from database whose username was provided
  const lookingFor = state.allRegistered.findIndex(
    (user) => user.username === username
  );

  if (lookingFor === -1)
    throwErrorMSg("username", "Taki użytkownik nie istnieje");
  // compare hashed passwords
  if (!(state.allRegistered[lookingFor].password === hashFunction(password)))
    throwErrorMSg("password", "Błędne hasło");

  // set state to logged
  Object.assign(state.loggedIn, state.allRegistered[lookingFor]);
  state.loggedIn.logged = true;
  setSessionStorage();
};

const hashFunction = function (str) {
  // calculate hash on hash numbers
  const hashNumber = [13, 37];
  let hashValue = Array.from(str)
    .map((letter) => letter.charCodeAt(0))
    .reduce(
      (acc, cvalue) => acc + cvalue * hashNumber[0] + cvalue * hashNumber[1]
    );

  // get always output 16-bit
  hashValue = 0x7fff & hashValue;
  return hashValue.toString(16);
};

const setSessionStorage = function () {
  window.sessionStorage.setItem("users", JSON.stringify(state.allRegistered));
  window.sessionStorage.setItem("logged", JSON.stringify(state.loggedIn));
};
export const loadSessionStorage = function () {
  const users = JSON.parse(window.sessionStorage.getItem("users"));
  if (!users) return;
  users.forEach((element) => {
    state.allRegistered.push(element);
  });

  const logged = JSON.parse(window.sessionStorage.getItem("logged"));
  if (!logged) return;
  state.loggedIn = { ...logged };
};
