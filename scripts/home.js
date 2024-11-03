//LogOut
function logOut() {
    window.location.href='index.html'
}

let mainBalance = parseInt(45000);
document.getElementById('balance').innerText=`$${mainBalance}`;

let amount;

// Add Money 
    const addMoneyForm = document.getElementById('add-money-form');
    const addMoneyInput = document.getElementById('firstAddMoneyAmount');
    const addMoneyPass = document.getElementById('addPassField');
    const addMoneyBtn = document.getElementById('firstAddMoneyBtn');

addMoneyBtn.addEventListener('click', (event) => {
    // Check if form is valid
    if (!addMoneyForm.checkValidity()) {
        // Let the browser handle validation (it will show required input warnings)
        return;
    }
    event.preventDefault();

    amount = parseInt(addMoneyInput.value)
    if (isNaN(amount)) {
        console.log('please enter a valid number')
    } else if (addMoneyPass.value ==='') {
        console.log('please enter right password')
    } else {
        showConfirmation('Add', amount, addMoneyInput, addMoneyPass)
    }
});

//Cash Out
const cashOutForm = document.getElementById('cash-out-form')
const cashOutInput = document.getElementById('firstCashOutAmount')
const cashOutPass = document.getElementById('cashOutPassField');
const cashOutBtn = document.getElementById('firstCashOutBtn')

cashOutBtn.addEventListener('click', (event)=> {
    if (!cashOutForm.checkValidity()) {
        return;
    }
    event.preventDefault();
    // Event Prevent Default: in logIn(event) to prevent page refresh on form submission.

    amount = parseInt(cashOutInput.value);
    if (isNaN(amount)) {
        console.log("Please enter a valid number.");
    } else if (cashOutPass==='') {
        console.log("Please enter the right password.");
    }
     else {
        showConfirmation('Cash Out', amount, cashOutInput, cashOutPass)    
    }
 }); 


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

    transactionData.inputElement = inputElement;
    transactionData.passElement = passElement;
    transactionData.amount = amount;
    transactionData.action = action;
}

yesCon.addEventListener('click', yesFun)
function yesFun() {
    if (transactionData.action==='Add') {
        mainBalance += transactionData.amount;
    } else if (transactionData.action==='Cash Out') {
        mainBalance -= transactionData.amount;
    }

    document.getElementById('balance').innerText=`$${mainBalance}`;
    transactionData.inputElement.value='';
    transactionData.passElement.value='';
    conMessage.classList.add('hidden');
    document.getElementById(`${transactionData.action.toLowerCase()}Btn`).disabled=true;
    
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