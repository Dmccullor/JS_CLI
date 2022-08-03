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

function displayAccounts() {
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
      let pin = answers.pin;
      let deposit = Number(answers.deposit);
      let transaction = makeTransaction('deposit', deposit);
      let customer = new Account(idCounter, name, pin, deposit, transaction);
      accountLedger.push(customer);
      principal = customer;
      console.log(chalk.bgCyan("\nNew account created!\n"));
      console.log(`Your new Account ID is ${chalk.yellow(idCounter++)}`);
      console.log(`Your PIN # is ${chalk.yellow(pin)}`);
      console.log(chalk.magenta('Save your ID and PIN!\n'));
      
      makeDeposit();
      // displayAccounts();
    })
}

async function makeDeposit() {
  let account = getAccountById(principal.id);

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
        account.balance = Number(account.balance) + Number(amount);
        let transaction = makeTransaction('deposit', amount);
        account.transactions.push(transaction);
        displayAccounts();
        console.log(principal);
      }
      else {
        // mainMenu();
      }
    })
}

await welcome();
await createAccount();