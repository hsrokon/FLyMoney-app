import { bankAccounts } from "./data.js";

//LogOut
function logOut() {
    window.location.href='index.html'
}

let mainBalance = localStorage.getItem('mainBalance') ? parseInt(localStorage.getItem('mainBalance')) : 45000;

let balance = document.getElementById('balance');
balance.innerText = `$${mainBalance}`;

let amount;

//Update Balance function
function updateBalance(amount, type) {
    if (type === 'add') {
        mainBalance += amount;
    } else if (type === 'subtract') {
        mainBalance -= amount;
    }

    localStorage.setItem('mainBalance', mainBalance);
    balance.innerText=`$${mainBalance}`;
}

//Pin storing and checking
let storePin  = localStorage.getItem('userPin') || '1234';
localStorage.setItem('userPin', storePin);

//Change Pin Feature
// function changePin(newPin) {
//     localStorage.setItem('userPin', newPin);
//     alert('Pin changed successfully!');
// }

// // Usage example:
// const newPin = prompt('Enter new pin:');
// changePin(newPin);

function checkPin(inputPin) {
    const storedPin = localStorage.getItem('userPin');
    return inputPin === storedPin;
}

// Add Money 
const addMoneyForm = document.getElementById('add-money-form');
const addMoneyInput = document.getElementById('fastAddMoneyAmount');
const addMoneyPass = document.getElementById('addPassField');
const addMoneyBtn = document.getElementById('fastaddmoneyBtn');
enableOnInput(addMoneyInput, addMoneyPass, addMoneyBtn);

//Verify Bank and Pin
function verifyBankAndPin(selectedBank, amount, enteredPin) {
    const bankData = bankAccounts[selectedBank];
    
    if (!bankData) {
        alert('Selected Bank is not found!');
        return false;
    } 

    const enteredAccountNumber = document.getElementById('addBankAccNum').value;
    if (bankData.accountNumber !== enteredAccountNumber) {
        alert('Account number does not match!')
        return false;
    }

    if (bankData.balance < amount) {
        alert('Insufficient fund in the selected bank account!');
        return false;
    }
    if (!checkPin(enteredPin)) {
        alert('Incorrect Pin!')
        return false;
    }
    return true;
}

addMoneyBtn.addEventListener('click', (event) => {
    // Check if form is valid
    if (!addMoneyForm.checkValidity()) return;
    event.preventDefault();
    // Event Prevent Default: in logIn(event) to prevent page refresh on form submission.

    const selectedBank = document.getElementById('bankAccountSelect').value;
    const amount = parseInt(addMoneyInput.value);
    const enteredPin = addMoneyPass.value;
     
    if (verifyBankAndPin(selectedBank, amount, enteredPin)) {
        showConfirmation('Add money', amount, addMoneyInput, addMoneyPass, selectedBank);
    }
});

//Cash Out
const cashOutForm = document.getElementById('cash-out-form')
const cashOutInput = document.getElementById('fastCashOutAmount')
const cashOutPass = document.getElementById('cashOutPassField');
const cashOutBtn = document.getElementById('fastcashoutBtn')
enableOnInput(cashOutInput, cashOutPass, cashOutBtn);

cashOutBtn.addEventListener('click', (event)=> {
    if (!cashOutForm.checkValidity()) {
        return;
    }
    event.preventDefault();
    
    const enteredPin = cashOutPass.value;
    if (!checkPin(enteredPin)) {
        alert('Incorrect Pin');
    } else {
        amount = parseInt(cashOutInput.value);
        if (isNaN(amount)) {
        console.log("Please enter a valid amount.");
        } else if (cashOutPass==='') {
        console.log("Please enter the right password.");
        } else {
        showConfirmation('Cash Out', amount, cashOutInput, cashOutPass)    
        }
    }
 }); 

 //Send Money
const sendMoneyForm = document.getElementById('send-money-form')
const sendMoneyInput = document.getElementById('fastSendMoneyAmount')
const sendMoneyPass = document.getElementById('sendMoneyPassField')
const sendMoneyBtn = document.getElementById('fastsendmoneyBtn')
enableOnInput(sendMoneyInput, sendMoneyPass, sendMoneyBtn);

sendMoneyBtn.addEventListener('click', (event)=> {
    if (!sendMoneyForm.checkValidity()) {
        return;
    }
    event.preventDefault();

    const enteredPin = sendMoneyPass.value;
    if (!checkPin(enteredPin)) {
        alert('Incorrect Pin');
    } else {
            amount =parseInt(sendMoneyInput.value)
        if (isNaN(amount)) {
        console.log("Please enter a valid amount.");
        } else if (sendMoneyPass==='') {
        console.log("Please enter the right password.");
        } else {
        showConfirmation('Send Money', amount, sendMoneyInput, sendMoneyPass)
        }
    }  
})

//Bill Pay
const payBillForm = document.getElementById('pay-bill-form')
const payBillInput = document.getElementById('fastPayBillAmount')
const payBillPass = document.getElementById('payBillPassField')
const payBillBtn = document.getElementById('fastpaybillBtn')
enableOnInput(payBillInput, payBillPass, payBillBtn);

payBillBtn.addEventListener('click', (event)=> {
    if (!payBillForm.checkValidity()) {
        return;
    }
    event.preventDefault();

    const enteredPin = payBillPass.value;
    if (!checkPin(enteredPin)) {
        alert('Incorrect Pin');
    } else {
            amount=parseInt(payBillInput.value)
        if (isNaN(amount)) {
        console.log("Please enter a valid amount.")
        } else if (payBillPass==='') {
        console.log("Please enter the right password.")
        } else {
        showConfirmation('Pay Bill', amount, payBillInput, payBillPass)
        }
    }
})

//confirmation msg
const conMessage = document.getElementById('conMessage');
const transactionAction = document.getElementById('transactionAction')
const transactionAmount = document.getElementById('transactionConfirmationAmount');
const yesCon = document.getElementById('yesCon');
const noCon = document.getElementById('noCon');

const transactionData ={};

function showConfirmation(action, amount, inputElement, passElement, selectedBank) {
    transactionAction.textContent=action;
    transactionAmount.textContent = `$${amount}`;
    conMessage.classList.remove('hidden');

    //before we click 'yes' or 'no' confirmation we're saving data to array for future use 
    transactionData.action = action;
    transactionData.amount = amount;
    transactionData.inputElement = inputElement;
    transactionData.passElement = passElement;
    transactionData.bank = selectedBank;
}

yesCon.addEventListener('click', yesFun)
// Use yesFun (without ()) to pass the function itself to be called on click, not immediately
const insufficientMsg = document.getElementById('insufficientMsg');
function yesFun() {
    const { action, amount, bank} = transactionData;
    // const requiredBalance = transactionData.amount;

    if ((action!=='Add Money') && (mainBalance < amount)) {
        insufficientMsg.classList.remove('hidden');
    } else {
        if (action==='Add money') {
        updateBalance(amount, 'add');
        bankAccounts[bank].balance -= amount;
        localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));//Updating & saving Bank balance after transaction
        popupFun();
        } else if (action==='Cash Out') {
        updateBalance(amount, 'subtract');
        popupFun();
        } else if (action==='Send Money') {
        updateBalance(amount, 'subtract');
        popupFun();
        } else if (action==='Pay Bill') {
        updateBalance(amount, 'subtract');
        popupFun();
        }
    }

    balance.innerText=`$${mainBalance}`;
    transactionData.inputElement.value='';
    transactionData.passElement.value='';
    conMessage.classList.add('hidden');
    document.getElementById(`fast${transactionData.action.toLowerCase().replace(/\s+/g,'')}Btn`).disabled=true;//.replace(/\s+/g, '') --- '/' marks start and end of pattern, '\s+' matches one or more spaces, 'g' for global (all) [g flag removes all occurrences], '' replaces with nothing thus removes all spaces 
}
//okInsufficient'
document.getElementById('okInsufficient').addEventListener('click', ()=> {
        insufficientMsg.classList.add('hidden');
})
//noCon
noCon.addEventListener('click', ()=> {
    conMessage.classList.add('hidden');
})

// Re-Enabling button
function enableOnInput(amountField, passField, button) {
    function checkField() {
        if (amountField.value.trim() !=='' && passField.value.trim() !=='') {
            //trim() removes any whitespace from the beginning and end of a string e.g. if amountField.value is " 100 ", amountField.value.trim() will return "100"
            //Although we don't need it here bcz we're not taking any whitespace input 
            button.disabled=false;
        } else {
            button.disabled=true;
        }
    }
    amountField.addEventListener('input', checkField);
    passField.addEventListener('input', checkField);
    //When user types in or removes text, the input event triggers, and checkFields is called
}

const defaultHome = document.getElementById('default-home');
function moneyOptions(selectedOption) {

    defaultHome.classList.add('hidden');
    const sections = ["add-money", "cash-out", "send-money", "cashback", "pay-bill", "transaction"];
    
    sections.forEach(section => {
        const sectionElement = document.getElementById(section);

        if (section === selectedOption) {
            sectionElement.classList.remove('hidden');  
        } else {
            sectionElement.classList.add('hidden');    
        }
    });
}
// Attach moneyOptions to window for global access in HTML onclick attributes | you explicitly add moneyOptions to the window object (the global object in browsers). This makes moneyOptions available throughout the HTML page, including in onclick
window.moneyOptions=moneyOptions;

// Transaction PopUp 
const popUp = document.getElementById('transactionModal');

function popupFun() {
    popUp.classList.remove('hidden');

    const TranName = document.getElementById('transactionName');
    const TranAmount = document.getElementById('transactionSuccessAmount');
    TranName.innerText=`${transactionData.action}`;
    TranAmount.innerText=`$${transactionData.amount}`;
    
}

document.getElementById('closeModal').addEventListener('click',()=> {
    popUp.classList.add('hidden');
})