
//LogOut
function logOut() {
    window.location.href='index.html'
}

let mainBalance = parseInt(45000);
document.getElementById('balance').innerText=`$${mainBalance}`;

// Add Money 
const addMoneyForm = document.getElementById('add-money-form');
const addMoneyInput = document.getElementById('firstAddMoneyAmount');
const addMoneyPass = document.getElementById('passwordField');
const addMoneyBtn = document.getElementById('firstAddMoneyBtn');
const addMoneyCon = document.getElementById('conMessage');
const addAmountCon = document.getElementById('transactionAmount');
const addYesCon = document.getElementById('yesCon');
const addNoCon = document.getElementById('noCon');


let moneyToAdd;

addMoneyBtn.addEventListener('click', (event) => {
    // Check if form is valid
    if (!addMoneyForm.checkValidity()) {
        // Let the browser handle validation (it will show required input warnings)
        return;
    }
    event.preventDefault();

    moneyToAdd = parseInt(addMoneyInput.value)

    if (isNaN(moneyToAdd)) {
        console.log('please enter a valid number')
    } else if (addMoneyPass.value ==='') {
        console.log('please enter right password')
    } else {
        addAmountCon.innerText=`$${moneyToAdd}`
        addMoneyCon.classList.remove('hidden')
    }
});

addYesCon.addEventListener('click', () => {
        mainBalance += moneyToAdd;
        document.getElementById('balance').innerText=`$${mainBalance}`
        addMoneyCon.classList.add('hidden')
        addMoneyInput.value=''
        addMoneyPass.value=''
        addMoneyBtn.disabled=true
});
addNoCon.addEventListener('click', () => {
        addMoneyCon.classList.add('hidden')
});
[addMoneyInput, addMoneyPass].forEach(input => {
    input.addEventListener('input', () => {
        addMoneyBtn.disabled = false;
    });
});


//Cash Out
document.getElementById('firstCashOutBtn').addEventListener('click', (event)=> {
    event.preventDefault();
    // Event Prevent Default: in logIn(event) to prevent page refresh on form submission.

    const moneyToCashOut = parseInt(document.getElementById('firstCashOutAmount').value);
    if (isNaN(moneyToCashOut)) {
        console.log("Please enter a valid number.");
    } else {
        mainBalance -= moneyToCashOut;
        document.getElementById('balance').innerText=`$${mainBalance}`;
    }
 }); 

const defaultHome = document.getElementById('default-home');
//This is also usable
// const addMoney = document.getElementById('add-money');
// const cashOut = document.getElementById('cash-out');
// const sendMoney = document.getElementById('send-money');
// const cashBack = document.getElementById('cashback');
// const payBill = document.getElementById('pay-bill');
// const transaction = document.getElementById('transaction');
// function moneyOptions(selectedOption) {   
//     if (!defaultHome.classList.contains('hidden')) {
//         defaultHome.classList.add('hidden');
//     } 
//     const sections = [addMoney,cashOut,sendMoney,cashBack,payBill,transaction];
//     sections.forEach(section => {
//         if (!section.classList.contains("hidden")) {
//           section.classList.add("hidden")  
//         }
//     });
//     document.getElementById(selectedOption).classList.remove("hidden");
// }
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