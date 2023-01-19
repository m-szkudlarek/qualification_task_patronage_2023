// CONFIG
const API = "https://api.npoint.io/38edf0c5f3eb9ac768bd";
const TIMEOUT_SEC = 10;
//---------------------------------------------------------------------------------------
export const state = {
  canRegister: true,
  loggedIn: { logged: false }, //logged user
  allRegistered: [], //all users
  language: "PL", //language webpage
};

export const logUser = function (user) {
  Object.assign(state.loggedIn, user);
  state.loggedIn.logged = true;
  setSessionStorage();
};
export const registerUser = function (user) {
  user.password = hashFunction(user.password);
  // set random transactions data
  user.transactions = customTransaction();
  state.allRegistered.push(user);
  logUser(user);
};

export const logOutUser = function () {
  state.loggedIn = { logged: false };
  setSessionStorage();
};
const errLangPick = function (plLang, enLang) {
  return state.language === "PL" ? plLang : enLang;
};
export const validUsername = function (username) {
  // non empty field
  if (!username.length)
    throwErrorMSg(
      "username",
      errLangPick("Pole nie może byc puste", "Field cannot be empty")
    );
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
      errLangPick(
        "Nazwa użytkownika musi zawierać od 6 do 16 znaków(w tym przynajmniej 5 liter i 1 cyfrę)",
        "Username must be between 6 and 16 characters long (at least 5 letters and 1 number)"
      )
    );

  if (state.allRegistered.some((acc) => acc.username === username))
    throwErrorMSg(
      "username",
      errLangPick(
        "Taki użytkownik już posiada konto",
        "This user already has an account"
      )
    );
};

export const validPassword = function (password) {
  // non empty field
  if (!password.length)
    throwErrorMSg(
      "password",
      errLangPick("Pole nie może byc puste", "Field cannot be empty")
    );
  if (password.length < 6)
    throwErrorMSg(
      "password",
      errLangPick(
        "Hasło powinno zawierać przynajmniej 6 znaków",
        "Password should contain at least 6 characters"
      )
    );
};

export const validEmail = function (email) {
  // non empty field
  if (!email.length)
    throwErrorMSg(
      "email",
      errLangPick("Pole nie może byc puste", "Field cannot be empty")
    );
  // regular expresion standard RFC 2822
  const regEx =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (!regEx.test(email))
    throwErrorMSg(
      "email",
      errLangPick("Niepoprawny format adres email", "Invalid email format")
    );

  // get the main adress email and search for aliases in gmail standard
  const matches = /(.*)@/g.exec(email);
  if (!matches) return;
  const adres = new RegExp(matches[1] + "+", "g");
  if (state.allRegistered.some((acc) => adres.test(acc.email)))
    throwErrorMSg(
      "email",
      errLangPick("Adres email jest już w użyciu", "Email already used")
    );
};

export const validEmailConfirm = function (email, emailConfirm) {
  // non empty field
  if (!emailConfirm.length)
    throwErrorMSg(
      "emailConfirm",
      errLangPick("Pole nie może byc puste", "Field cannot be empty")
    );
  if (!(email === emailConfirm))
    throwErrorMSg(
      "emailConfirm",
      errLangPick(
        "Podane email'e musza byc takie same",
        "Email's must be the same"
      )
    );
};
// creat new Error ,using the .name property to display the error on the appropriate field
const throwErrorMSg = function (name, msg) {
  const err = new Error(msg);
  err.name = name;
  throw err;
};

export const validLogin = function (login, password) {
  if (!login.length)
    throwErrorMSg(
      "login",
      errLangPick("Pole nie może byc puste", "Field cannot be empty")
    );
  if (!password.length)
    throwErrorMSg(
      "password",
      errLangPick("Pole nie może byc puste", "Field cannot be empty")
    );

  // get user from database whose username was provided
  const lookingFor = state.allRegistered.findIndex(
    (user) => user.username === login || user.email === login
  );

  const regEx =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (regEx.test(login) && lookingFor === -1)
    throwErrorMSg(
      "login",
      errLangPick(
        "Użytkownik o takim mail'u nie posiada konta.Skorzystaj z darmowej rejestracji!",
        "The user with this e-mail does not have an account. Take advantage of the free registration!"
      )
    );
  if (lookingFor === -1)
    throwErrorMSg(
      "login",
      errLangPick("Taki użytkownik nie istnieje", "User doesn't exist")
    );
  // compare hashed passwords
  if (!(state.allRegistered[lookingFor].password === hashFunction(password)))
    throwErrorMSg("password", errLangPick("Błędne hasło", "Invalid password"));

  return state.allRegistered[lookingFor];
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

// Function to prevent too long time data fetch
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const fetchData = async function () {
  try {
    const fetchData = fetch(API);
    const res = await Promise.race([timeout(TIMEOUT_SEC), fetchData]);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const recognizeDevice = function () {
  state.isChangeMainLayout = window.matchMedia("(min-width: 768px)").matches
    ? -1
    : 1;
};

function customTransaction() {
  const myCustomTransactionData = `
  [
   [
      {
        "amount": -99,
        "balance": 254.45,
        "date": "2021-10-15",
        "description": "Sklep u mańka",
        "type": 2
      },
      {
        "amount": -299.00,
        "balance": -45.45,
        "date": "2021-10-14",
        "description": "Opiekunka",
        "type": 4
      },
      {
        "amount": 5000,
        "balance": 8100,
        "date": "2022-11-12",
        "description": "Wynagrodzenie z tytułu pracy",
        "type": 3
      },
      {
        "amount": -231.56,
        "balance": 7737.25,
        "date": "2022-11-13",
        "description": "Biedronka 13",
        "type": 2
      },
      {
        "amount": -10000,
        "balance": -3240.75,
        "date": "2022-11-14",
        "description": "Zakup samochodu",
        "type": 4
      }
    ],
    [
      {
        "amount": -99,
        "balance": 254.45,
        "date": "2021-10-18",
        "description": "Sklep u mańka",
        "type": 2
      },
      {
        "amount": -299.00,
        "balance": -45.45,
        "date": "2021-10-17",
        "description": "Opiekunka",
        "type": 4
      },
      {
        "amount": 5000,
        "balance": 8100,
        "date": "2021-10-20",
        "description": "Wynagrodzenie z tytułu pracy",
        "type": 3
      },
      {
        "amount": -231.56,
        "balance": 7737.25,
        "date": "2021-10-23",
        "description": "Biedronka 13",
        "type": 2
      },
      {
        "amount": -10000,
        "balance": -3240.75,
        "date": "2021-10-24",
        "description": "Zakup samochodu",
        "type": 4
      },
      {
        "amount": -10000,
        "balance": -13240.75,
        "date": "2021-10-26",
        "description": "Rata kredytu",
        "type": 4
      },
      {
        "amount": 13240.75,
        "balance": 0,
        "date": "2021-10-27",
        "description": "Pozyczka",
        "type": 4
      }
    ],
     [
      {
        "amount": -13240.75,
        "balance": 1,
        "date": "2023-01-18",
        "description": "Spłata długu",
        "type": 4
      },
      {
        "amount": -200,
        "balance": 13241.75,
        "date": "2023-01-17",
        "description": "Zakupy żabka",
        "type": 2
      },
      {
        "amount": -2137,
        "balance": 6000,
        "date": "2023-01-16",
        "description": "Lorem ipsum",
        "type": 2
      },
      {
        "amount": 2000,
        "balance": 8241.75,
        "date": "2023-01-15",
        "description": "Wynagrodzenie",
        "type": 3
      },
      {
        "amount": 2000,
        "balance": 10241.75,
        "date": "2023-01-14",
        "description": "Wynagrodzenie",
        "type": 3
      },
      {
        "amount": -20,
        "balance": 10221.75,
        "date": "2023-01-13",
        "description": "Kebab",
        "type": 3
      },
      {
        "amount": -20,
        "balance": 10201.75,
        "date": "2023-01-12",
        "description": "Kebab",
        "type": 3
      },
      {
        "amount": -20,
        "balance": 10181.75,
        "date": "2023-01-11",
        "description": "Kebab",
        "type": 3
      },
      {
        "amount": -20,
        "balance": 10161.75,
        "date": "2023-01-10",
        "description": "Kebab",
        "type": 3
      },
      {
        "amount": -20,
        "balance": 10141.75,
        "date": "2023-01-09",
        "description": "Kebab",
        "type": 3
      },
      {
        "amount": -20,
        "balance": 10121.75,
        "date": "2023-01-08",
        "description": "Kebab",
        "type": 3
      },
      {
        "amount": -20,
        "balance": 10101.75,
        "date": "2023-01-07",
        "description": "Kebab",
        "type": 3
      },
      {
        "amount": -20,
        "balance": 10081.75,
        "date": "2023-01-06",
        "description": "Kebab",
        "type": 3
      }
    ]
    ]
  `;
  const obj = JSON.parse(myCustomTransactionData);
  const randomNumber = Math.floor(Math.random() * obj.length);
  // console.log(obj);
  return obj[randomNumber];
}
