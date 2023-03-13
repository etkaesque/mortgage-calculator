
function calculateAmortizationSchedule(loanAmount, interestRate, loanTermYears) {
    const loanTermMonths = loanTermYears * 12;
    const monthlyInterestRate = (interestRate / 12) / 100;
    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
  
    let balance = loanAmount;
    let payments = [];
  
    for (let month = 1; month <= loanTermMonths; month++) {
      const interest = balance * monthlyInterestRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      payments.push({
        month,
        payment: monthlyPayment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance.toFixed(2)
      });
    }
  
    return payments;
  }
  
  
  
  
  function writeIntoTables(payments) {
  
    // Get a reference to the table body
    const tableBody = document.getElementById('table-body');
  
    // Loop through the payment data arrays and create a row for each payment
    for (let i = 0; i < payments.length; i++) {
      // Create a new row element
      const row = document.createElement('tr');
  
      //
  
      const paymentMonth = document.createElement('td');
      paymentMonth.textContent = payments[i]['month'];
      row.appendChild(paymentMonth);
  
      const paymentPayment = document.createElement('td');
      paymentPayment.textContent = payments[i]['payment'];
      row.appendChild(paymentPayment);
  
      const paymentPrincipal = document.createElement('td');
      paymentPrincipal.textContent = payments[i]['principal'];
      row.appendChild(paymentPrincipal);
  
      const paymentInterest = document.createElement('td');
      paymentInterest.textContent = payments[i]['interest'];
      row.appendChild(paymentInterest);
  
      const paymentBalance = document.createElement('td');
      paymentBalance.textContent = payments[i]['balance'];
      row.appendChild(paymentBalance);
  
      // Add the row to the table body
      tableBody.appendChild(row);
    }
  
  
  }
  
  
  
  function grafikas() {
  
  
    let loanTermYears = 30
  
  
    let loanAmount = 100000
  
  
    let interestRate = 5
  
  
    const payments = calculateAmortizationSchedule(loanAmount, interestRate, loanTermYears);
    writeIntoTables(payments)
  
  
  }

  grafikas()
  

