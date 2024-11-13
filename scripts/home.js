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
        showConfirmation('Add Money', null, amount, addMoneyInput, addMoneyPass, selectedBank);
    }
});

//Cash Out
const cashOutForm = document.getElementById('cash-out-form')
const cashOutNumber = document.getElementById('fastCashOutNumber');
const cashOutInput = document.getElementById('fastCashOutAmount')
const cashOutPass = document.getElementById('cashOutPassField');
const cashOutBtn = document.getElementById('fastcashoutBtn')
enableOnInput(cashOutInput, cashOutPass, cashOutBtn);

cashOutBtn.addEventListener('click', (event)=> {
    if (!cashOutForm.checkValidity()) {
        return;
    }
    event.preventDefault();
    
    const number = cashOutNumber.value;
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
        showConfirmation('Cash Out', number, amount, cashOutInput, cashOutPass)    
        }
    }
 }); 

//Send Money
const sendMoneyForm = document.getElementById('send-money-form')
const sendMoneyNumber = document.getElementById('fastSendMoneyNumber')
const sendMoneyInput = document.getElementById('fastSendMoneyAmount')
const sendMoneyPass = document.getElementById('sendMoneyPassField')
const sendMoneyBtn = document.getElementById('fastsendmoneyBtn')
enableOnInput(sendMoneyInput, sendMoneyPass, sendMoneyBtn);

sendMoneyBtn.addEventListener('click', (event)=> {
    if (!sendMoneyForm.checkValidity()) {
        return;
    }
    event.preventDefault();

    const number = sendMoneyNumber.value;
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
        showConfirmation('Send Money', number, amount, sendMoneyInput, sendMoneyPass)
        }
    }  
})

//Bill Pay
const payBillForm = document.getElementById('pay-bill-form')
const payBillNumber = document.getElementById('fastPayBillNumber')
const payBillInput = document.getElementById('fastPayBillAmount')
const payBillPass = document.getElementById('payBillPassField')
const payBillBtn = document.getElementById('fastpaybillBtn')
enableOnInput(payBillInput, payBillPass, payBillBtn);

payBillBtn.addEventListener('click', (event)=> {
    if (!payBillForm.checkValidity()) {
        return;
    }
    event.preventDefault();

    const number = payBillNumber.value;
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
        showConfirmation('Pay Bill', number, amount, payBillInput, payBillPass)
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

function showConfirmation(action, number, amount, inputElement, passElement, selectedBank) {
    transactionAction.textContent=action;
    transactionAmount.textContent = `$${amount}`;
    conMessage.classList.remove('hidden');

    //before we click 'yes' or 'no' confirmation we're saving data to array for future use 
    transactionData.action = action;
    transactionData.number = number;
    transactionData.amount = amount;
    transactionData.inputElement = inputElement;
    transactionData.passElement = passElement;
    transactionData.bank = selectedBank;
}

yesCon.addEventListener('click', yesFun)
// Use yesFun (without ()) to pass the function itself to be called on click, not immediately
const insufficientMsg = document.getElementById('insufficientMsg');
function yesFun() {
    const { action, number, amount, bank} = transactionData;
    // const requiredBalance = transactionData.amount;

    if ((action!=='Add Money') && (mainBalance < amount)) {
        insufficientMsg.classList.remove('hidden');
    } else { 
        //updateBalance(amount, action === 'Add Money' ? 'add' : 'subtract');
        if (action==='Add Money') {
        updateBalance(amount, 'add');
        bankAccounts[bank].balance -= amount;
        localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts)); //Updating & saving Bank balance after transaction
        } else if (action==='Cash Out') {
        updateBalance(amount, 'subtract');
        } else if (action==='Send Money') {
        updateBalance(amount, 'subtract');
        } else if (action==='Pay Bill') {
        updateBalance(amount, 'subtract');
        }

        transactionHistory.push({
            type: action,
            to : number || 'N/A',
            amount,
            bank: bank || 'N/A',
            date: new Date().toLocaleString()  // capture date and time
        });
        renderTransactionHistory();
        popupFun();
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

//Transaction History
const transactionHistory = [];//global array

let showAllTransactions = false;
const viewAllButton = document.getElementById('viewAllTransactions');

function renderTransactionHistory() {
    const historyContainer = document.getElementById('transaction-history');
    historyContainer.innerHTML=''; // Clear existing content

    transactionHistory.sort((a,b) => new Date(b.date) - new Date(a.date)); // Sort transactions by date (newest first)

    // Determine how many transactions to show
    const transactionsToShow = showAllTransactions ? transactionHistory : transactionHistory.slice(0,3);

    transactionsToShow.forEach((transaction) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('w-11/12', 'mx-auto', 'mt-3', 'bg-white', 'rounded-xl', 'px-3', 'py-2', 'shadow-sm',
        'hover:bg-gray-50', 'hover:border-none', 'hover:cursor-pointer', 'transition', 'duration-200', 'ease-in-out')

        let toField = transaction.to ? `<p>To : ${transaction.to}</p>` : '';
        let bankField = transaction.bank ? `<p>From : ${transaction.bank}</p>` : '';

        historyItem.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex  items-center">
                        <div class="bg-slate-100 p-2 rounded-full">
                        <img class="w-4"  src="Icons/${transaction.type.replace(" ","")}.svg" alt=""> 
                        </div>
                        
                        <div class="flex flex-col justify-between text-xs text-left ml-2">
                            <p>${transaction.type}</p>
                            ${transaction.type !== 'Add Money' ? toField : ''}
                            <p>Amount : $${transaction.amount}</p>
                            ${transaction.type == 'Add Money' ? bankField : ''}
                            <p>${transaction.date}</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg> 
                </div>
            </div>`;
            historyContainer.appendChild(historyItem);
    });

    viewAllButton.textContent = showAllTransactions ? 'Show Less' : 'View All';
};

// Add event listener to the "View All" button to toggle the view
viewAllButton.addEventListener('click', ()=> {
    showAllTransactions = !showAllTransactions;
    renderTransactionHistory(); // Re-render the transaction history
})