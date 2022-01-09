const table = document.querySelector('#list')

function edit(i) {
    const editButton = document.querySelector(`#order${i}`)
    if (editButton.value === 'edit') {
        editButton.innerHTML = "Save"
        editButton.value = 'save'
        editButton.classList.remove("btn-primary")
        editButton.classList.add("btn-success")
        enableEdit(i)
    }
    else {
        editButton.innerHTML = `<i class="fa fa-edit "></i>Edit`
        editButton.value = 'edit'
        editButton.classList.remove("btn-success")
        editButton.classList.add("btn-primary")
        disableEdit(i)
    }

}

function enableEdit(i) {
    editingPaymentStatus(i)
    editingDeliveryStatus(i)
}

function editingPaymentStatus(i) {

}

function editingDeliveryStatus(i) {
    const row = table.rows[i + 1];
    const paymentStatusInput = row.cells[4]

    paymentStatusInput.innerHTML = `
    <select name="">
        <option value="Awaiting for confirmation">Awaiting for confirmation</option>
        <option value="Confirmed and Delivering">Confirmed and Delivering</option>
        <option value="Order has been delivered">Order has been delivered</option>
    </select>`
}

function disableEdit(i) {

}