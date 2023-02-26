
function calculateMortgage() {


    // let loanPeriod = document.getElementById('loanperiod').value;

    let loanPeriod = document.getElementById('loanperiod').valueAsNumber;

    console.log(`Paskolos ilgis: ${loanPeriod} metų`)


    // let loanAmount = document.getElementById('loanamount').value;

    let loanAmount = document.getElementById('loanamount').valueAsNumber;

    console.log(`Paskolos suma: ${loanAmount} €`)

    // let interest = document.getElementById('interest').value;
    let interest = document.getElementById('interest').valueAsNumber;

    console.log(`Palūkanų norma: ${interest} %`)

    // let monthlyIncome = document.getElementById('income').value;
    let monthlyIncome = document.getElementById('income').valueAsNumber;

    console.log(`Pajamos kas mėnesį: ${monthlyIncome} €`)

    // let obligationsAmount = document.getElementById('obligationtotal').value;
    let obligationsAmount = document.getElementById('obligationtotal').valueAsNumber;

    console.log(`Bendra įsipareigojimų suma: ${obligationsAmount} €`)

    // let obligationsMonthly = document.getElementById('obligationmonthly').value;
    let obligationsMonthly = document.getElementById('obligationmonthly').valueAsNumber;

    console.log(`Bendra įsipareigojimų įmoka kas mėn.: ${obligationsMonthly} €`)



    let estateValue = 117000;


    // 1. definitions:

    // 1.1 define stess interest
    let interestStress = interest + 2;

    // 1.2 define minimal income 
    let minIncome = 600;

    // interest to decimal
    let interestDecimal = interest / 100
    let interestDecimalStress = interestStress / 100


    // calculates LTV 

    function calculateLTV(loanAmount, estateValue) {


        let LTV = (loanAmount / estateValue) * 100

        LTV = Math.round(LTV)

        console.log(`Finansuojama turto vertės dalis (LTV): ${LTV}%`)
        return LTV
    }

    let LTV = calculateLTV(loanAmount, estateValue)

    // calculates monthly mortgage payment. 


    function monthlyMortagePayment(interest, loanAmount, loanPeriod, dontprint) {

        payment = (loanAmount * (interest / 12)) / (1 - (1 + (interest / 12)) ** (-12 * loanPeriod))

        payment = Math.round(payment)

        // will not print a message or will print a message if calculating based on DTI or DSTI
        if (dontprint) {
            return payment
        } else if (interest == interestDecimalStress) {
            console.log(`Mėnesio įmoka už būsto kredita su stress palūkanomis: ${payment} €`)
        } else if (interest == interestDecimal) {
            console.log(`Mėnesio įmoka už būsto kredita: ${payment} €`)
        } return payment

    }

    // calculates DTI

    let DTI = ((monthlyMortagePayment(interestDecimal, loanAmount, loanPeriod) + obligationsMonthly) / monthlyIncome) * 100

    DTI = DTI.toFixed(2)

    console.log(`DTI: ${DTI} %`)

    // calculates DSTI 

    let DSTI = ((monthlyMortagePayment(interestDecimalStress, loanAmount, loanPeriod) + obligationsMonthly) / monthlyIncome) * 100

    DSTI = DSTI.toFixed(2)

    console.log(`DSTI: ${DSTI} %`)

    // calculates LTI

    let LTI = (loanAmount + obligationsAmount) / monthlyIncome

    LTI = LTI.toFixed(2)

    console.log(`LTI: ${LTI}`)

    // 2. Max Loan Amount

    // 2.1 MAX LTI: Will calculate maximum loan amount based on LTI. Annual income times 6 minus obilgation amount

    maxLTI = (monthlyIncome * 72) - obligationsAmount

    console.log(`Max LTI loan amount is ${maxLTI} €`)

    // 2.2 MAX monthly DTI: Will check if monthly income is not too low and will calculate maximum monthly payment for mortage, but not more than 40% of monthly income 

    let maxDTIMontlyPayment = 0;

    if ((monthlyIncome - minIncome) / (monthlyIncome) > 0.4) {

        maxDTIMontlyPayment = monthlyIncome * 0.4 // suskaičiuoja max. mėn įmoka, t.y ne daugiau nei 40 proc nuo mėn, pajamų.
    } else {
        maxDTIMontlyPayment = monthlyIncome - minIncome
        console.log("pagal max DTI skolinti negalima")
    }


    // PV function and MAX DTI. Will calculate maximum loan amount when DTI is 40%

    function PV(rate, nper, pmt) {
        return pmt / rate * (1 - Math.pow(1 + rate, -nper));
    }

    maxDTI = PV(interestDecimal / 12, 360, maxDTIMontlyPayment)

    maxDTI = Math.round(maxDTI)

    console.log(`Max DTI loan amount is ${maxDTI} €`)

    // calculates total cost of the loan 

    mp = monthlyMortagePayment(interestDecimal, loanAmount, loanPeriod, true)

    let loanCost = mp * 12 * loanPeriod

    console.log(`Bendra mokama suma: ${loanCost} €`)

    //  calculates total interest paid 

    let totalInterest = loanCost - loanAmount

    console.log(`Iš viso sumokama palūkanų: ${totalInterest} €`)

    // max Loan 

    if (maxDTI > maxLTI) {
        maxLoan = maxLTI
    } else {
        maxLoan = maxDTI
    }


    // write to html


    document.getElementById("monthly-payment").innerHTML = `Mėn. įmoka už būsto kreditą: ${mp} €`;


    document.getElementById("DSTI").innerHTML = `DTI stess: ${DSTI} %`;


    document.getElementById("max-loan").innerHTML = `Maksimaliai galima pasiskolinti: ${maxLoan} €`;

    document.getElementById("loan-cost").innerHTML = `Bendra sumokama suma: ${loanCost} €`;

    document.getElementById("total-interest").innerHTML = `Iš viso sumokama palūkanų: ${totalInterest} €`;

    if (DTI>40) {
        document.getElementById("DTI").innerHTML = `DTI: ${DTI} %. Pasiskolinti negalite, bendra mėn. įsipareigojimų įmoka negali viršyti 40% mėnesinių pajamų.`;
        document.getElementById("max-loan").innerHTML = `Maksimaliai galima pasiskolinti: ${0} €`;
        document.getElementById("max-loan").style.color = "red";
        document.getElementById("DTI").style.color = "red";
    } else {
        document.getElementById("DTI").innerHTML = `DTI: ${DTI} %`;
        document.getElementById("DTI").style.color = "black";
        document.getElementById("max-loan").style.color = "black";
    }

    if (LTI>75) {
        document.getElementById("LTI").innerHTML = `LTI: ${LTI}. Pasiskolinti negalite, paskola negali būti didesnė nei 75 kartai už jūsų mėnesines pajamas`;
        document.getElementById("max-loan").innerHTML = `Maksimaliai galima pasiskolinti: ${0} €`;
        document.getElementById("max-loan").style.color = "red";
        document.getElementById("LTI").style.color = "red";
    } else {
        document.getElementById("LTI").innerHTML = `LTI: ${LTI}`;
        document.getElementById("LTI").style.color = "black";
        document.getElementById("max-loan").style.color = "black";
    }
    





}
