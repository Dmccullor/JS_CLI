import {accountLedger} from '../dollarsbank_app.js'

export const sleep = (ms = 2000) => new Promise ((r) => setTimeout(r, ms));

export function getAccountById(id) {
  for (let account of accountLedger) {
    if(account.id === id) {
      return account;
    }
  }
}