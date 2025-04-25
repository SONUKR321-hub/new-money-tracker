// Initialize records array with your existing data
let records = [
    {
        date: "2023-04-13",
        credit: 450,
        source: "ishan-",
        description: "unknown",
        spent: 450,
        recipient: "unknown",
    },
    {
        date: "2023-04-19",
        credit: 450,
        source: "ishan",
        description: "unknown",
        spent: 450,
        recipient: "unknown",
    },
    {
        date: "2023-04-21",
        credit: 450,
        source: "ishan-",
        description: "deepanshu ko diye 800 baki tha",
        spent: 450,
        recipient: "deepanshu",
    },
    {
        date: "2023-04-22",
        credit: 450,
        source: "ishan-",
        description: "deepanshu ko diye bacha hua",
        spent: 350,
        recipient: "Deepanshu",
    },
    {
        date: "2023-04-23",
        credit: 450,
        source: "ishan",
        description: "pizza+unknown",
        spent: 261,
        recipient: "pizza",
    },
    {
        date: "2023-04-24",
        credit: 900,
        source: "",
        description: "arpit ko diyen 500 baki tha+perfume me diye",
        spent: 650,
        recipient: "",
    }
];

// Check if there's existing data in localStorage
const storedRecords = localStorage.getItem('incomeExpenseRecords');
if (!storedRecords) {
    // If no existing data, save the initial records
    localStorage.setItem('incomeExpenseRecords', JSON.stringify(records));
} else {
    // If there's existing data, use that instead
    records = JSON.parse(storedRecords);
}

// DOM elements
const recordForm = document.getElementById('record-form');
const recordsBody = document.getElementById('records-body');
const totalCreditElement = document.getElementById('total-credit');
const totalSpentElement = document.getElementById('total-spent');
const balanceLeftElement = document.getElementById('balance-left');
const footerCreditElement = document.getElementById('footer-credit');
const footerSpentElement = document.getElementById('footer-spent');
const footerBalanceElement = document.getElementById('footer-balance');

// DOM elements for edit modal
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeModalBtn = document.querySelector('.close');
const editIndexInput = document.getElementById('edit-index');
const editDateInput = document.getElementById('edit-date');
const editCreditInput = document.getElementById('edit-credit');
const editSourceInput = document.getElementById('edit-source');
const editDescriptionInput = document.getElementById('edit-description');
const editAmountInput = document.getElementById('edit-amount');
const editRecipientInput = document.getElementById('edit-recipient');

// Format date for display (DD-MMM format)
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}-${month}`;
}

// Format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2);
}

// Calculate balance for a record
function calculateBalance(credit, spent) {
    return credit - spent;
}

// Update the summary and footer totals
function updateSummary() {
    let totalCredit = 0;
    let totalSpent = 0;
    
    records.forEach(record => {
        totalCredit += parseFloat(record.credit || 0);
        totalSpent += parseFloat(record.spent || 0);
    });
    
    const balanceLeft = totalCredit - totalSpent;
    
    totalCreditElement.textContent = formatCurrency(totalCredit);
    totalSpentElement.textContent = formatCurrency(totalSpent);
    balanceLeftElement.textContent = formatCurrency(balanceLeft);
    
    footerCreditElement.textContent = totalCredit.toFixed(2);
    footerSpentElement.textContent = totalSpent.toFixed(2);
    footerBalanceElement.textContent = balanceLeft.toFixed(2);
}

// Render all records in the table
function renderRecords() {
    recordsBody.innerHTML = '';
    let cumulativeBalance = 0;
    
    records.forEach((record, index) => {
        const balance = calculateBalance(record.credit || 0, record.spent || 0);
        cumulativeBalance += balance;
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${record.credit || 0}</td>
            <td>${record.source || ''}</td>
            <td>${record.description || ''}</td>
            <td>${record.spent || 0}</td>
            <td>${record.recipient || ''}</td>
            <td class="${balance > 0 ? 'positive-balance' : balance < 0 ? 'negative-balance' : 'zero-balance'}">${balance.toFixed(2)}</td>
            <td class="${cumulativeBalance > 0 ? 'positive-balance' : cumulativeBalance < 0 ? 'negative-balance' : 'zero-balance'}">${cumulativeBalance.toFixed(2)}</td>
            <td class="action-buttons">
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `;
        
        recordsBody.appendChild(row);
    });
    
    updateSummary();
    saveRecords();
}

// Save records to localStorage
function saveRecords() {
    localStorage.setItem('incomeExpenseRecords', JSON.stringify(records));
}

// Add a new record
function addRecord(event) {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const credit = parseFloat(document.getElementById('credit').value) || 0;
    const source = document.getElementById('source').value;
    const description = document.getElementById('description').value;
    const spent = parseFloat(document.getElementById('amount').value) || 0;
    const recipient = document.getElementById('recipient').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    if (credit === 0 && spent === 0) {
        alert('Please enter either a credit or spent amount');
        return;
    }
    
    const newRecord = {
        date,
        credit,
        source,
        description,
        spent,
        recipient
    };
    
    records.push(newRecord);
    recordForm.reset();
    renderRecords();
}

// Delete a record
function deleteRecord(index) {
    if (confirm('Are you sure you want to delete this record?')) {
        records.splice(index, 1);
        renderRecords();
    }
}

// Open edit modal and populate with record data
function openEditModal(index) {
    const record = records[index];
    
    editIndexInput.value = index;
    editDateInput.value = record.date;
    editCreditInput.value = record.credit || 0;
    editSourceInput.value = record.source || '';
    editDescriptionInput.value = record.description || '';
    editAmountInput.value = record.spent || 0;
    editRecipientInput.value = record.recipient || '';
    
    editModal.style.display = 'block';
}

// Update a record
function updateRecord(event) {
    event.preventDefault();
    
    const index = parseInt(editIndexInput.value);
    const date = editDateInput.value;
    const credit = parseFloat(editCreditInput.value) || 0;
    const source = editSourceInput.value;
    const description = editDescriptionInput.value;
    const spent = parseFloat(editAmountInput.value) || 0;
    const recipient = editRecipientInput.value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    if (credit === 0 && spent === 0) {
        alert('Please enter either a credit or spent amount');
        return;
    }
    
    records[index] = {
        date,
        credit,
        source,
        description,
        spent,
        recipient
    };
    
    editModal.style.display = 'none';
    renderRecords();
}

// Close the modal
function closeModal() {
    editModal.style.display = 'none';
}

// Event listeners
recordForm.addEventListener('submit', addRecord);
editForm.addEventListener('submit', updateRecord);
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        closeModal();
    }
});

// Event delegation for edit and delete buttons
recordsBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        deleteRecord(index);
    } else if (event.target.classList.contains('edit-btn')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        openEditModal(index);
    }
});

// Initial render
renderRecords();