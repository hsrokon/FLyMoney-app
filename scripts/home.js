
//LogOut
function logOut() {
    window.location.href='index.html'
}

const mainBalance = parseInt(45000);
document.getElementById('balance').innerText=`$${mainBalance}`;

// Add Money 
const moneyAdded = parseInt(document.getElementById('firstAddMoneyAmount').value);
console.log(moneyAdded)
function name(params) {
    document.getElementById('firstAddMoney').addEventListener('click', ()=> {
       mainBalance += moneyAdded;
    });
}

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