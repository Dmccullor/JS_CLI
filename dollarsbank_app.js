#!/usr/bin/env node

// TODO
// 1. create menu(inquire type list)
// 2. create login(create account or login)(login sets principal)

// imports
import chalk from 'chalk';
import inquirer from 'inquirer';
import {Account, makeTransaction} from './src/model.js';

// HELPER FUNCTIONS
const sleep = (ms = 2000) => new Promise ((r) => setTimeout(r, ms));

async function displayAccounts() {
  return console.log(accountLedger);
}

function getAccountById(id) {
  for (let account of accountLedger) {
    if(account.id === id) {
      return account;
    }
  }
}

// HELPER FUNCTIONS END


// MENU FUNCTIONS
async function welcome() {
  console.log(chalk.green("+-----------------------------+" + 
              "\n|   WELCOME TO DOLLARS BANK   |" +
              "\n+-----------------------------+\n"));

  await sleep();
}

async function initMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'init',
        message: 'What would you like to do?',
        choices: ['Create New Account', 'Login', 'Exit']
      }
    ])
    .then(answer => {
      switch(answer.init) {
        case 'Login':
          loginAccount();
          break;
        case 'Create New Account':
          createAccount();
          break;
        case 'Exit':
          console.log(chalk.magenta('Goodbye!'));
          process.exit();
        default: 'Something went wrong';
      }
    })
}

async function loginAccount() {
  console.log(chalk.bgYellow('\nLogin to Account:\n'));

  await sleep();

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'idNum',
        message: 'Please enter your Account ID #:',
        validate: (answer) => {
          if(isNaN(answer)) {
            return chalk.red('ID must be a number');
          }
          else if (answer <= 0) {
            return chalk.red('ID must be greater than 0');
          }
          else {
            return true;
          }
        }
      },
      {
        type: 'password',
        name: 'pinNum',
        mask: '*',
        message: 'Please enter your 4-digit PIN #:',
        validate: (answer) => {
          if(isNaN(answer)) {
            return chalk.red('Please enter a 4 digit number');
          }
          else if(answer.toString().length !== 4) {
            return chalk.red('PIN must be 4 digits');
          }
          else {
            return true
          }
        }
      }
    ])
    .then(answers => {
      let accountId = Number(answers.idNum);
      let pinNum = Number(answers.pinNum);
      
      let account = getAccountById(accountId);

      if(account == undefined) {
        console.log(chalk.red('Account not found.\n'));
        initMenu();
      }
      else {
        if(account.pin == pinNum) {
          console.log(chalk.magenta('\nLogin Success!'));
          console.log(`Welcome ${chalk.cyan(account.name)}!\n`);
          principal = account;
          mainMenu();
        }
        else {
          console.log(chalk.red('Login Failure.'));
          console.log(chalk.red('PIN Incorrect\n'));
          initMenu();
        }
      }
    })
}

async function mainMenu() {
  console.log(chalk.bgGreen('~~~~~MAIN MENU~~~~~\n'));

  await sleep();
  
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'main',
        message: 'Please select an option below:',
        choices: ['Deposit', 'Withdraw', 'Balance', 'Update PIN', 'Transaction History', 'Logout']
      }
    ])
    .then(answer => {
      switch (answer.main) {
        case 'Deposit':
          makeDeposit();
          break;
        case 'Withdraw':
          makeWithdrawal();
          break;
        case 'Balance':
          viewBalance();
          break;
        case 'Update PIN':
          updatePin();
          break;
        case 'Transaction History':
          viewTransactions();
          break;
        case 'Logout':
          initMenu();
        default:
          'Something went wrong'
      }
    })
}

// MENU FUNCTIONS END

// global variable declarations
var idCounter = 1;
var principal;
var accountLedger = [];


// LOGIN FUNCTIONS
async function createAccount() {
  console.log(chalk.bgYellow('\nCreate New Account\n'));

  await sleep();
  
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?',
        validate: (answer) => {
          if(isNaN(answer) == false) {
            return chalk.red('Your name must be a word');
          }
          else if(answer == '') {
            return chalk.red("Name cannot be blank");
          }
          else {
            return true
          }
        }
      },
      {
        type: 'password',
        name: 'pin',
        message: 'Please enter a 4-digit PIN for your account:',
        mask: '*',
        validate: (answer) => {
          if(isNaN(answer)) {
            return chalk.red('Please enter a 4 digit number');
          }
          else if(answer.toString().length !== 4) {
            return chalk.red('PIN must be 4 digits');
          }
          else {
            return true
          }
        }
      },
      {
        type: 'input',
        name: 'deposit',
        message: 'New accounts require a deposit of at least $500. How much would you like to deposit?',
        validate: (answer) => {
          if(isNaN(answer)) {
            return chalk.red('Please enter a valid number');
          }
          else if (answer < 500) {
            return chalk.red('Deposit must be at least $500');
          }
          else {
            return true
          }
        }
      }
    ])
    .then(answers => {
      let name = answers.name;
      let pin = Number(answers.pin);
      let deposit = Number(answers.deposit);
      let transaction = makeTransaction('deposit', deposit);
      let customer = new Account(idCounter, name, pin, deposit, transaction);
      accountLedger.push(customer);
      principal = customer;
      console.log(chalk.bgCyan("\nNew account created!\n"));
      console.log(`Your new Account ID is ${chalk.yellow(idCounter++)}`);
      console.log(`Your PIN # is ${chalk.yellow(pin)}`);
      console.log(chalk.magenta('Save your ID and PIN!\n'));
      
      mainMenu();
    })
}
// LOGIN FUNCTIONS END

// MAIN MENU FUNCTIONS
async function makeDeposit() {
  let account = getAccountById(principal.id);

  console.log(chalk.green('MAKE DEPOSIT\n'));

  await sleep();

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'amount',
        message: 'How much do you want to deposit?',
        validate: (answer) => {
          if(isNaN(answer)) {
            return chalk.red('Amount must be a number');
          }
          else if (answer <= 0) {
            return chalk.red('Amount must be greater than 0');
          }
          else {
            return true;
          }
        }
      },
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are you sure you want to deposit?'
      }
    ])
    .then(answers => {
      let amount = Number(answers.amount);

      if(answers.confirmation) {
        account.balance = account.balance + amount;
        let transaction = makeTransaction('deposit', amount);
        account.transactions.push(transaction);
        console.log(`\n${chalk.cyan('Deposit Success!')} Your new account balance is ${chalk.green('$' + account.balance)}\n`);
      }
      else {
        console.log(chalk.bgRed('Transaction cancelled. Returning to Main Menu.\n'));
      }
      mainMenu();
    })
}

async function makeWithdrawal() {
  let account = getAccountById(principal.id);

  console.log(chalk.red('MAKE WITHDRAWAL\n'));

  await sleep();

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'amount',
        message: 'How much do you want to withdraw?',
        validate: (answer) => {
          if(isNaN(answer)) {
            return chalk.red('Amount must be a number');
          }
          else if (answer <= 0) {
            return chalk.red('Amount must be greater than 0');
          }
          else if (answer > account.balance) {
            return chalk.red('Amount cannot be more than you have in your account!');
          }
          else {
            return true;
          }
        }
      },
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are you sure you want to withdraw?'
      }
    ])
    .then(answers => {
      let amount = Number(answers.amount);

      if(answers.confirmation) {
        account.balance = account.balance - amount;
        let transaction = makeTransaction('withdrawal', amount);
        account.transactions.push(transaction);
        console.log(`\n${chalk.cyan('Withdrawal Success!')} Your new account balance is ${chalk.green('$' + account.balance)}\n`);
      }
      else {
        console.log(chalk.bgRed('Transaction cancelled. Returning to Main Menu\n'));
      }
      mainMenu();
    })
}

async function viewTransactions() {
  let account = getAccountById(principal.id);
  let transactionList = account.transactions;

  console.log(chalk.magenta('\nTransaction Log:'));
  console.log(chalk.magenta('--------------------'));
  console.log(transactionList);
  console.log('');
  
  await sleep();
  await sleep();
  
  mainMenu();
}

async function viewBalance() {
  let account = getAccountById(principal.id);
  let accountBalance = account.balance;

  console.log(chalk.cyan('\nAccount Balance:'));
  console.log(chalk.cyan('--------------------'));
  console.log(chalk.green(`$${accountBalance}\n`));

  await sleep();
  await sleep();

  mainMenu();
}

async function updatePin() {
  let account = getAccountById(principal.id);

  console.log(chalk.yellow('Update PIN\n'));

  await sleep();
  
  inquirer
    .prompt([
      {
        type: 'password',
        name: 'newPin',
        message: 'Please enter your new PIN #:',
        mask: '*',
        validate: (answer) => {
          if(isNaN(answer)) {
            return chalk.red('Please enter a 4 digit number');
          }
          else if(answer.toString().length !== 4) {
            return chalk.red('PIN must be 4 digits');
          }
          else if (Number(answer) == account.pin) {
            return chalk.red('New PIN cannot be the same as old PIN');
          }
          else {
            return true;
          }
        }
      },
      {
        type: 'confirm',
        name: 'pinConfirm',
        message: 'Are you sure you want to reset your PIN?',
      }
    ])
    .then(answers => {
      if(answers.pinConfirm) {
        account.pin = Number(answers.newPin);

        console.log(`\n${chalk.cyan('Success!')} Your new PIN # is ${chalk.yellow(account.pin)}\n`);
      }
      else {
        console.log(chalk.bgRed('Transaction cancelled. Returning to Main Menu\n'));
      }
      mainMenu();
    })
}

// MAIN MENU FUNCTIONS END

await welcome();
await initMenu();