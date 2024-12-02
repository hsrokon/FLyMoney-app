//LogOut
function logOut() {
    window.location.href='index.html'
}

let mainBalance = localStorage.getItem('mainBalance') ? parseInt(localStorage.getItem('mainBalance')) : 45000;

let balanceElement = document.getElementById('balance');
balanceElement.innerText = `$${mainBalance}`;

let amount;

async function fetchBalance() {
    try {
        const response = await fetch('http://localhost:5000/api/balance');
        if(!response.ok) throw new Error("Error fetching balance");
        const {balance} = await response.json();
        mainBalance = balance;
        balanceElement.innerText=`$${mainBalance}`;
        localStorage.setItem('mainBalance', mainBalance);
    } catch (error) {
        console.error(error);
    }
}

//Update Balance function
function updateBalance(amount, type) {
    if (type === 'add') {
        mainBalance += amount;
    } else if (type === 'subtract') {
        mainBalance -= amount;
    }
    balance.innerText=`$${mainBalance}`;
}

function checkPin(inputPin) {
    const storedPin = localStorage.getItem('userPin') || '1234';
    return inputPin === storedPin;
}

// Add Money 
const addMoneyForm = document.getElementById('add-money-form');
const addMoneyInput = document.getElementById('fastAddMoneyAmount');
const addMoneyPass = document.getElementById('addPassField');
const addMoneyBtn = document.getElementById('fastaddmoneyBtn');
enableOnInput(addMoneyInput, addMoneyPass, addMoneyBtn);
addMoneyForm.addEventListener('submit', (event)=> {
    if (!addMoneyForm.checkValidity()) return;
    event.preventDefault();
    const amount = parseInt(addMoneyInput.value);
    const pin = addMoneyPass.value;
    if (checkPin(pin)) {
        showConfirmation('Add Money', null, amount, addMoneyInput, addMoneyPass, document.getElementById('bankAccountSelect').value);
    } else {
        alert('Invalid PIN');
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
    if (!cashOutForm.checkValidity()) return;
    event.preventDefault();
    const number = cashOutNumber.value;
    const amount = parseInt(cashOutInput.value);
    const pin = cashOutPass.value;
    if (checkPin(pin)) {
        amount> mainBalance ? insufficientMsg.classList.remove('hidden') : showConfirmation('Cash Out', number, amount, cashOutInput, cashOutPass);
    } else {
        alert('Invalid PIN');
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
    if (!sendMoneyForm.checkValidity()) return;
    event.preventDefault();
    const number = sendMoneyNumber.value;
    const amount = parseInt(sendMoneyInput.value);
    const pin = sendMoneyPass.value;
    if (checkPin(pin)) {
        amount> mainBalance ? insufficientMsg.classList.remove('hidden') : showConfirmation('Send Money', number, amount, sendMoneyInput, sendMoneyPass);
    } else {
        alert('Invalid PIN');
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
    if (!payBillForm.checkValidity()) return;
    event.preventDefault();
    const number = payBillNumber.value;
    const amount = parseInt(payBillInput.value);
    const pin = payBillPass.value;
    if (checkPin(pin)) {
        amount> mainBalance ? insufficientMsg.classList.remove('hidden') : showConfirmation('Pay Bill', number, amount, payBillInput, payBillPass);
    } else {
        alert('Invalid PIN');
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
async function yesFun() {
    const { action, number, amount, bank} = transactionData;
    // const requiredBalance = transactionData.amount;

    try {
        const response = await fetch(`http://localhost:5000/api/transaction`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action, number, amount, bank}),
        });
        if (!response.ok) throw new Error('Transaction failed');
        const result = await response.json();

        // Update balance
        if (result.success) {
            updateBalance(amount, action==='Add Money' ? 'add' : 'subtract');
            fetchTransactionHistory();
            popupFun()
        }

        alert(result.message);
    } catch (error) {
        console.error(error);
        alert('Transaction Failed');
    } finally {
        transactionData.inputElement.value='';
        transactionData.passElement.value='';
        conMessage.classList.add('hidden');
    }

    document.getElementById(`fast${transactionData.action.toLowerCase().replace(/\s+/g,'')}Btn`).disabled=true;
    //.replace(/\s+/g, '') --- '/' marks start and end of pattern, '\s+' matches one or more spaces, 'g' for global (all) [g flag removes all occurrences], '' replaces with nothing thus removes all spaces 
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

        if (!sectionElement) {
            console.error(`Section with ID '${section}' not found.`);
            return;
        }

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

// Fetch and Render Transaction History
async function fetchTransactionHistory() {
    try {
        const response = await fetch('http://localhost:5000/api/transactions');
        if (!response.ok) throw new Error("Error fetching transaction history");
        const transactions = await response.json();
        renderTransactionHistory(transactions);
    } catch (error) {
        console.error(error);
    }
}


let showAllTransactions = false;
const viewAllButton = document.getElementById('viewAllTransactions');

function renderTransactionHistory(transactions) {
    const historyContainer = document.getElementById('transaction-history');
    historyContainer.innerHTML=''; // Clear existing content

    transactions.sort((a,b) => new Date(b.date) - new Date(a.date)); 
    //The subtraction new Date(b.date) - new Date(a.date) gives a positive or negative value:If the result is positive, b is newer than a, so b comes first in the sorted order.If the result is negative, a is newer than b, so a comes first

    // Determine how many transactions to show
    const transactionsToShow = showAllTransactions ? transactions : transactions.slice(0,3);

    transactionsToShow.forEach((transaction) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('transaction-item','w-11/12', 'mx-auto', 'mt-3', 'bg-white', 'rounded-xl', 'px-3', 'py-2', 'shadow-sm',
        'hover:bg-gray-50', 'hover:border-none', 'hover:cursor-pointer', 'transition', 'duration-200', 'ease-in-out')

        let toField = transaction.number ? `<p>To : ${transaction.number}</p>` : '';
        let bankField = transaction.bank ? `<p>From : ${transaction.bank}</p>` : '';

        historyItem.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex  items-center">
                        <div class="bg-slate-100 p-2 rounded-full">
                        <img class="w-4"  src="Icons/${transaction.action.replace(" ","")}.svg" alt=""> 
                        </div>
                        
                        <div class="flex flex-col justify-between text-xs text-left ml-2">
                            <p>${transaction.action}</p>
                            ${transaction.action !== 'Add Money' ? toField : ''}
                            <p>Amount : $${transaction.amount}</p>
                            ${transaction.action == 'Add Money' ? bankField : ''}
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
    fetchTransactionHistory(); // Re-render the transaction history
}) 

// Call initial functions
fetchBalance();
fetchTransactionHistory();