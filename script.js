'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.3, // in %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Samuel Egbeola',
  movements: [2100, -350, -100, 1200, -50, -1650, 500, -250],
  interestRate: 0.8,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// DOM Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// To create usernames to each of the accounts
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user.slice(0, 1))
      .join('');
  });
};
createUsernames(accounts);

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = ''; // this empties the content of the account movement container

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}₤</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// To calculate the balance for each account
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (movement, mov) => (movement += mov)
  );
  labelBalance.textContent = `${account.balance}₤`;
};

// To calculate deposits, withdrawals and interest
const calcDisplaySummary = function (account) {
  // for deposits
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₤`;

  // for withdrawals
  const outgoing = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outgoing)}₤`;

  const interests = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + (mov * account.interestRate) / 100, 0);
  labelSumInterest.textContent = `${interests}₤`;
};

// To update the user interface
const updateUI = function (account) {
  // Display movements (or transactions)
  displayMovements(account);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
};

// EVENT HANDLERS
// To create LOGIN functionality
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // this prevents the form from submitting

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    console.log(`logged in as ${currentAccount.owner}`);

    // Display UI and welcome message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;

    // Clear the input field and make it lose being focused on
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update the user interface
    updateUI(currentAccount);
  }
});

// To create inter-account TRANSFER functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // this prevents the form from submitting

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // this makes the input fields lose focus
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount.username !== currentAccount?.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Update the user interface
    updateUI(currentAccount);
  }
});

// To implement the LOAD REQUEST functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  // The loan should only be granted if there is at least one deposit that is at least 30% of the requested amount
  if (currentAccount.movements.some(mov => mov >= loanAmount * 0.3)) {
    // Grant the loan request
    currentAccount.movements.push(loanAmount);

    // Update the user interface
    updateUI(currentAccount);
  }
});

// To implement the account closing functionality
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // return back to the welcome page
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;

    // delete account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
  }

  // this makes the input fields lose focus
  inputCloseUsername.value = inputClosePin.value = '';
});

// To implement the movements SORTING functionality
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(`clicked`);

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
