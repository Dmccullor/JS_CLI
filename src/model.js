export function Account (id, name, pin, balance, transactions) {
    this.id = id;
    this.name = name;
    this.pin = pin;
    this.balance = balance;
    this.transactions = [transactions];
}

function convertDatetime(stamp) {
    const dateObject = new Date(stamp);
    const readableDate = dateObject.toLocaleString();
    return readableDate;
}

export function makeTransaction (type, amount) {
    let transaction = {
        "Type": type,
        "Amount": amount,
        "Date": convertDatetime(Date.now())
    }

    return transaction;
}