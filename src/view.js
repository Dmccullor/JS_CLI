import chalk from 'chalk';
import inquirer from 'inquirer';
import {principal, mainMenu} from '../dollarsbank_app.js'
import {sleep, getAccountById} from './util.js'
import { makeTransaction } from './model.js';

export async function makeDeposit() {
    let account = getAccountById(principal.id);
  
    console.log(chalk.green('\nMAKE DEPOSIT\n'));
  
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
          console.log(`\n${chalk.cyan('Deposit Success!')} Your new account balance is ${chalk.green('$' + (account.balance).toFixed(2))}\n`);
        }
        else {
          console.log(chalk.bgRed('Transaction cancelled. Returning to Main Menu.\n'));
        }
        mainMenu();
      })
  }
  
export async function makeWithdrawal() {
    let account = getAccountById(principal.id);
  
    console.log(chalk.red('\nMAKE WITHDRAWAL\n'));
  
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
          console.log(`\n${chalk.cyan('Withdrawal Success!')} Your new account balance is ${chalk.green('$' + (account.balance).toFixed(2))}\n`);
        }
        else {
          console.log(chalk.bgRed('Transaction cancelled. Returning to Main Menu\n'));
        }
        mainMenu();
      })
  }
  
export async function viewTransactions() {
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
  
export async function viewBalance() {
    let account = getAccountById(principal.id);
    let accountBalance = account.balance;
  
    console.log(chalk.cyan('\nAccount Balance:'));
    console.log(chalk.cyan('--------------------'));
    console.log(chalk.green(`$${accountBalance.toFixed(2)}\n`));
  
    await sleep();
    await sleep();
  
    mainMenu();
  }
  
export async function updatePin() {
    let account = getAccountById(principal.id);
  
    console.log(chalk.yellow('\nUpdate PIN\n'));
    
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
          console.log(chalk.bgRed('PIN update cancelled. Returning to Main Menu\n'));
        }
        mainMenu();
      })
  }
  
export async function showInfo() {
    console.log(`\nName: ${chalk.cyan(principal.name)}`);
    console.log(`ID: ${chalk.yellow(principal.id)}`);
    console.log(`Balance: ${chalk.green('$' + principal.balance)}\n`);
    await sleep();
    await sleep();
    mainMenu();
  }