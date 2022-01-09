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
    const row = table.rows[i + 1];
    const paymentStatusInput = row.cells[4]
    let paymentStatusInputValue = 0;

    if (paymentStatusInput.innerText == "Ongoing") {
        paymentStatusInputValue = 0
    }
    else
        paymentStatusInputValue = 1

    paymentStatusInput.innerHTML = `
    <select id="paymentStatus${i}">
        <option value="0" selected>Ongoing</option>
        <option value="1">Paid</option>
    </select>`

    $(`#paymentStatus${i} option[value='${paymentStatusInputValue}']`).attr("selected", "selected");
}

function editingDeliveryStatus(i) {
    const row = table.rows[i + 1];
    const deliveryStatusInput = row.cells[5]
    let deliveryStatusInputValue = 0;

    if (deliveryStatusInput.innerText === "Confirmed and Delivering") {
        deliveryStatusInputValue = 0
    }
    else
        deliveryStatusInputValue = 1

    deliveryStatusInput.innerHTML = `
    <select id="deliveryStatus${i}">
        <option value="0" selected>Confirmed and Delivering</option>
        <option value="1">Order has been delivered</option>
    </select>`

    $(`#deliveryStatus${i} option[value='${deliveryStatusInputValue}']`).attr("selected", "selected");
}

function disableEdit(i) {
    const paymentStatus = disablePaymentStatusEdit(i)
    const deliveryStatus = disableDeliveryStatusEdit(i)

    const row = table.rows[i + 1];
    const orderId = row.cells[0].innerText

    saveChanges(orderId, paymentStatus, deliveryStatus)
}

function disablePaymentStatusEdit(i) {
    const paymentStatus = document.querySelector(`#paymentStatus${i}`).value

    const row = table.rows[i + 1];
    const paymentStatusInput = row.cells[4]

    if (paymentStatus == 1) {
        paymentStatusInput.innerHTML = "Paid"
    }
    else
        paymentStatusInput.innerHTML = "Ongoing"


    return paymentStatus;
}

function disableDeliveryStatusEdit(i) {
    const deliveryStatus = document.querySelector(`#deliveryStatus${i}`).value

    const row = table.rows[i + 1];
    const deliveryStatusInput = row.cells[5]

    if (deliveryStatus == 1) {
        deliveryStatusInput.innerHTML = "Order has been delivered"
    }
    else
        deliveryStatusInput.innerHTML = "Confirmed and Delivering"


    return deliveryStatus;
}

function saveChanges(i, p, d) {
    $.ajax({
        method: "POST",
        url: "/accountant/orders/edit",
        data: { id: i, payment: p, delivery: d },
    })
}