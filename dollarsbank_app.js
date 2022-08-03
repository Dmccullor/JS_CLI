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

async function welcome() {
  console.log(chalk.green("+-----------------------------+" + 
              "\n|   WELCOME TO DOLLARS BANK   |" +
              "\n+-----------------------------+\n"));

  await sleep();
}

// global variable declarations
var idCounter = 1;
var principal;
var accountLedger = [];

async function createAccount() {
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
        type: 'number',
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
      let pin = answers.pin;
      let deposit = answers.deposit;
      let transaction = makeTransaction('deposit', deposit);
      let customer = new Account(idCounter, name, pin, deposit, transaction);
      accountLedger.push(customer);
      principal = customer;
      console.log(chalk.bgCyan("\nNew account created!\n"));
      console.log(`Your new Account ID is ${chalk.yellow(idCounter++)}`);
      console.log(`Your PIN # is ${chalk.yellow(pin)}`);
      console.log(chalk.magenta('Save your ID and PIN!\n'));
      
      makeDeposit();
    })
}

async function makeDeposit() {
  let account = getAccountById(principal.id);

  inquirer
    .prompt([
      {
        type: 'number',
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
      // let amount = Number(answers.amount);
      let amount = answers.amount;

      if(answers.confirmation) {
        account.balance = account.balance + amount;
        let transaction = makeTransaction('deposit', amount);
        account.transactions.push(transaction);
        console.log(`\n${chalk.cyan('Deposit Success!')} Your new account balance is ${chalk.green('$' + account.balance)}\n`);
      }
      else {
        // mainMenu();
      }
      makeWithdrawal();
    })
}

async function makeWithdrawal() {
  let account = getAccountById(principal.id);

  inquirer
    .prompt([
      {
        type: 'number',
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
      let amount = answers.amount;

      if(answers.confirmation) {
        account.balance = account.balance - amount;
        let transaction = makeTransaction('withdrawal', amount);
        account.transactions.push(transaction);
        console.log(`\n${chalk.cyan('Withdrawal Success!')} Your new account balance is ${chalk.green('$' + account.balance)}\n`);
      }
      else {
        // mainMenu();
      }
      viewTransactions();
    })
}

async function viewTransactions() {
  let account = getAccountById(principal.id);
  let transactionList = account.transactions;

  console.log(chalk.bgCyan('\nTransaction Log:'));
  console.log(chalk.cyan('--------------------'));
  console.log(transactionList);
  viewBalance();
}

async function viewBalance() {
  let account = getAccountById(principal.id);
  let accountBalance = account.balance;

  console.log(chalk.bgCyan('\nAccount Balance:'));
  console.log(chalk.cyan('--------------------'));
  console.log(chalk.green(`$${accountBalance}\n`));

  updatePin();
}

async function updatePin() {
  let account = getAccountById(principal.id);
  
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
        account.pin = answers.newPin;

        console.log(`\n${chalk.cyan('Success!')} Your new PIN # is ${chalk.yellow(account.pin)}\n`);
      }
      else {
        // mainMenu();
      }
      displayAccounts();
    })
}

await welcome();
await createAccount();