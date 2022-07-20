const dropList = document.querySelectorAll(".drop-list select");
const getButton = document.querySelector("form button");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const exchangeRateTxt = document.querySelector(".exchange-rate");
const exchangeIcon = document.querySelector(".drop-list .icon");
const apiKey = "d466995c991d28c2970ef40e";

for (i = 0; i < dropList.length; i++){ //for the select tags
    for (currency_code in country_code){ //for looping through the currency_codes
        let selected;
        if (i == 0 && currency_code == "USD"){
            selected = "selected";
        } else if(i == 1 && currency_code == "EUR") {
            selected = "selected";
        }
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }

    dropList[i].addEventListener("change", (e) => {
        loadFlag(e.target);
    })
}

//function to change flags with respect to their option values
function loadFlag(element){
    for (currency_code in country_code){ 
        if (currency_code == element.value){ //if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img");    
            imgTag.src = `https://countryflagsapi.com/png/${country_code[currency_code]}`;
        }
    }
}

exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;

    loadFlag(fromCurrency);
    loadFlag(toCurrency);

    getExchangeRate();
})

window.addEventListener("load", () =>{
    getExchangeRate();
})

getButton.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
})

function getExchangeRate(){
    const amount = document.querySelector(".amount input");
    let amountVal = amount.value;

    if (amountVal == "" || amountVal == "0"){
        amount.value = 1;
    }

    exchangeRateTxt.innerText = "Getting rate...";

    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;

    fetch(url).then(res => res.json()).then(result =>{
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        console.log(totalExchangeRate);
    }).catch(() => { //if user is offline or any other error occured while fetching data, then the catch function will be executed
        exchangeRateTxt.innerText = "Something went wrong";
    });
}