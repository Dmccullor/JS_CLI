export function Account (id, name, pin, balance, transactions) {
    this.id = id;
    this.name = name;
    this.pin = pin;
    this.balance = balance;
    this.transactions = [transactions];
}

export function makeTransaction (type, amount) {
    let transaction = {
        "Type": type,
        "Amount": amount,
        "Date": Date.now()
    }

    return transaction;
}