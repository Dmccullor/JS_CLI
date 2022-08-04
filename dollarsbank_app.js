#!/usr/bin/env node

// imports
import chalk from 'chalk';
import inquirer from 'inquirer';
import {Account, makeTransaction} from './src/model.js';
import {sleep, getAccountById} from './src/util.js'
import { makeDeposit, makeWithdrawal, viewTransactions, viewBalance, updatePin, showInfo } from './src/view.js';

// global variable declarations
var idCounter = 1;
export var principal;
export var accountLedger = [];


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
          console.log(chalk.magenta('Goodbye.'));
          process.exit();
        default: 'Something went wrong';
      }
    })
}

async function loginAccount() {
  console.log(chalk.bgYellow('\nLogin to Account:\n'));

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

export async function mainMenu() {
  console.log(chalk.bgGreen('\n~~~~~MAIN MENU~~~~~\n'));
  
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'main',
        message: 'Please select an option below:',
        choices: ['Deposit', 'Withdraw', 'Balance', 'Update PIN', 'Transaction History', 'Display Info', 'Logout']
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
        case 'Display Info':
          showInfo();
          break;
        case 'Logout':
          initMenu();
        default:
          'Something went wrong'
      }
    })
}

// MENU FUNCTIONS END


// LOGIN FUNCTIONS
async function createAccount() {
  console.log(chalk.bgYellow('\nCreate New Account\n'));
  
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

// INITIALIZATION
await welcome();
await initMenu();