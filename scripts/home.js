//LogOut
function logOut() {
    window.location.href='index.html'
}

let balance = document.getElementById('balance')
let mainBalance = parseInt(45000);
balance.innerText=`$${mainBalance}`;

let amount;

// Add Money 
const addMoneyForm = document.getElementById('add-money-form');
const addMoneyInput = document.getElementById('fastAddMoneyAmount');
const addMoneyPass = document.getElementById('addPassField');
const addMoneyBtn = document.getElementById('fastaddmoneyBtn');
enableOnInput(addMoneyInput, addMoneyPass, addMoneyBtn);

addMoneyBtn.addEventListener('click', (event) => {
    // Check if form is valid
    if (!addMoneyForm.checkValidity()) {
        // Let the browser handle validation (it will show required input warnings)
        return;
    }
    event.preventDefault();
    // Event Prevent Default: in logIn(event) to prevent page refresh on form submission.

    amount = parseInt(addMoneyInput.value)
    if (isNaN(amount)) {
        console.log('please enter a valid amount')
    } else if (addMoneyPass.value ==='') {
        console.log('please enter right password')
    } else {
        showConfirmation('Add money', amount, addMoneyInput, addMoneyPass);
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
    
    amount = parseInt(cashOutInput.value);
    if (isNaN(amount)) {
        console.log("Please enter a valid amount.");
    } else if (cashOutPass==='') {
        console.log("Please enter the right password.");
    }
     else {
        showConfirmation('Cash Out', amount, cashOutInput, cashOutPass)    
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

    amount =parseInt(sendMoneyInput.value)
    if (isNaN(amount)) {
        console.log("Please enter a valid amount.");
    } else if (sendMoneyPass==='') {
        console.log("Please enter the right password.");
    } else {
        showConfirmation('Send Money', amount, sendMoneyInput, sendMoneyPass)
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

    amount=parseInt(payBillInput.value)
    if (isNaN(amount)) {
        console.log("Please enter a valid amount.")
    } else if (payBillPass==='') {
        console.log("Please enter the right password.")
    } else {
        showConfirmation('Pay Bill', amount, payBillInput, payBillPass)
    }
})

//confirmation msg
const conMessage = document.getElementById('conMessage');
const transactionAction = document.getElementById('transactionAction')
const transactionAmount = document.getElementById('transactionConfirmationAmount');
const yesCon = document.getElementById('yesCon');
const noCon = document.getElementById('noCon');

const transactionData ={};

function showConfirmation(action, amount, inputElement, passElement) {
    transactionAction.textContent=action;
    transactionAmount.textContent = `$${amount}`;
    conMessage.classList.remove('hidden');

    //before we click 'yes' or 'no' confirmation we're saving data to array for future use 
    transactionData.action = action;
    transactionData.amount = amount;
    transactionData.inputElement = inputElement;
    transactionData.passElement = passElement;
}

yesCon.addEventListener('click', yesFun)
// Use yesFun (without ()) to pass the function itself to be called on click, not immediately
const insufficientMsg = document.getElementById('insufficientMsg');
function yesFun() {
    const requiredBalance = transactionData.amount;

    if ((transactionData.action!=='Add Money') && (mainBalance < requiredBalance)) {
        insufficientMsg.classList.remove('hidden');
    } else {
        if (transactionData.action==='Add money') {
        mainBalance += transactionData.amount;
        popupFun();
        } else if (transactionData.action==='Cash Out') {
        mainBalance -= transactionData.amount;
        popupFun();
        } else if (transactionData.action==='Send Money') {
        mainBalance -= transactionData.amount;
        popupFun();
        } else if (transactionData.action==='Pay Bill') {
        mainBalance -= transactionData.amount;
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