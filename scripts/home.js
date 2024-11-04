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
    const addMoneyBtn = document.getElementById('fastAddMoneyBtn');

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
        showConfirmation('Add', amount, addMoneyInput, addMoneyPass)
    }
});

//Cash Out
const cashOutForm = document.getElementById('cash-out-form')
const cashOutInput = document.getElementById('fastCashOutAmount')
const cashOutPass = document.getElementById('cashOutPassField');
const cashOutBtn = document.getElementById('fastCashOutBtn')

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
const sendMoneyBtn = document.getElementById('fastSendMoneyBtn')

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

//confirmation msg
const conMessage = document.getElementById('conMessage');
const transactionAction = document.getElementById('transactionAction')
const transactionAmount = document.getElementById('transactionAmount');
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
function yesFun() {
    if (transactionData.action==='Add') {
        mainBalance += transactionData.amount;
    } else if (transactionData.action==='Cash Out') {
        mainBalance -= transactionData.amount;
    } else if (transactionData.action==='Send Money') {
        mainBalance -= transactionData.amount;
    }

    balance.innerText=`$${mainBalance}`;
    transactionData.inputElement.value='';
    transactionData.passElement.value='';
    conMessage.classList.add('hidden');
    document.getElementById(`${transactionData.action.toLowerCase()}Btn`).disabled=true;//this will not work since variables are in camelCase and without space
    
}
noCon.addEventListener('click', ()=> {
    conMessage.classList.add('hidden');
})


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

    const TranAmount = document.getElementById('transactionAmount');
    TranAmount.innerText=`$${amount}`;
}

document.getElementById('closeModal').addEventListener('click',()=> {
    popUp.classList.add('hidden');
})