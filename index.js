const inputSlider = document.querySelector("[data-slider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbercaseCheck = document.querySelector("#Numbers");
const symbolcaseCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()-=+{}[]?|/:_;"\.<,>';

let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
// set strength circle color to gray
setIndicator("#ccc");

// set passwrord length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generatRndNumber(){
    return getRandomInteger(0,9);
}

function generatLowerCase(){
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generatUpperCase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generatSymbol(){
    const randNum = getRandomInteger(0,symbol.length);
    return symbol.charAt(randNum);

}

// copy krna h isko 
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbercaseCheck.checked) hasNum = true;
    if (symbolcaseCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){

    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
        
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
    
}


function shufflePassword(array){
    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp  = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    // special condiditon
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})
inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})


generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected

    if(checkCount == 0)
        return;
    
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password 
    password = "";

    // let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generatUpperCase(); 
    // }

    // if(lowercaseCheck.checked){
    //     password += generatLowerCase(); 
    // }

    // if(numbercaseCheck.checked){
    //     password += generatRndNumber(); 
    // }

    // if(symbolcaseCheck.checked){
    //     password += generatSymbol(); 
    // }

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generatUpperCase); 
    }

    if(lowercaseCheck.checked){
        funcArr.push(generatLowerCase); 
    }

    if(numbercaseCheck.checked){
        funcArr.push(generatRndNumber); 
    }

    if(symbolcaseCheck.checked){
        funcArr.push(generatSymbol); 
    }

    // compulasry addition
    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // Remaining addition
    for(let i = 0; i<passwordLength - funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password 
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password

    calcStrength();


})