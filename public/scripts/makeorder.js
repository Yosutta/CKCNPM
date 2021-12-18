const input = document.querySelector('#productname')
const checkoutBtn = document.querySelector('#checkoutBtn')
const form = document.querySelector('#searchform')
const table = document.querySelector('#list')
const addButton = document.querySelector('#addButton')
const paymentTable = document.querySelector('#paymentForm')

const list = []
let foundProducts = []

function calc() {
    const tb = document.querySelector('#list')
    let orderTotal = 0
    for (let i = 1, row; row = tb.rows[i]; i++) {
        const { body } = new DOMParser().parseFromString(row.cells[4].innerHTML, 'text/html');
        const qInput = body.querySelector('#quantity').innerHTML

        const price = row.cells[1].innerHTML
        const total = parseFloat(price) * parseInt(qInput)
        row.cells[5].innerHTML = total
        orderTotal += total
    }

    paymentTable.rows[4].cells[1].innerHTML = orderTotal
}

checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    checkOut(list)
})

input.addEventListener('input', () => {
    $.ajax({
        method: "GET",
        url: "/order/search",
        data: { search: input.value },
        success: function (daata) {
            getProduct(daata)
        }
    })
})

$('#list').click(function () {
    console.log(list)
})

function getProduct(data) {
    foundProducts = data['result']
    let productNames = []
    for (let i = 0; i < foundProducts.length; i++) {
        productNames.push(foundProducts[i]['name'])
    }
    $('#productname').autocomplete({
        source: productNames,
        select: function (e, ui) {
            readData(ui)
        }
    })
}

function fetchData(ui) {
    return $.ajax({
        method: "GET",
        url: "/order/detail",
        data: { detail: ui['item']['value'] },
    })
}

async function readData(ui) {
    try {
        const res = await fetchData(ui)
        console.log(res, 1)
        let product = res['result']
        $('#addBtn').unbind().bind('click', function (event) {
            event.preventDefault();
            list.push(product)
            addToGrid(list)
            input.value = ""
            input.focus()
        });
    } catch (err) {
        console.log(err);
    }
}

function addToGrid(list) {
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    for (let i = 0; i < list.length; i++) {
        const product = list[i]
        let row = table.insertRow(1);

        let productName = row.insertCell(0);
        let price = row.insertCell(1);
        let quantity = row.insertCell(2);
        let productManufacturer = row.insertCell(3);
        let ordered = row.insertCell(4)
        let total = row.insertCell(5)

        productName.innerHTML = product['name']
        productManufacturer.innerHTML = product['manufacturer']
        quantity.innerHTML = product['quantity']
        ordered.innerHTML = product['ordered'] || '<div contenteditable id="quantity" onkeyup="calc()"></div>'
        price.innerHTML = product['price']
        // total.innerHTML = product['ordered'] * product['price'];
    }
}

function checkOut(list) {
    const tb = document.querySelector('#list')
    list.reverse()
    for (let i = 1, row; row = tb.rows[i]; i++) {
        const { body } = new DOMParser().parseFromString(row.cells[4].innerHTML, 'text/html');
        const qInput = body.querySelector('#quantity').innerHTML
        list[i - 1]['ordered'] = qInput
    }

    let orderAmount = paymentTable.rows[4].cells[1].innerHTML
    let orderPaymentMethod = document.querySelector('#payment').value
    let orderPhoneNumber = document.querySelector('#deliveryphonenumber').value
    let orderAddress = document.querySelector('#deliveryaddress').value

    paymentList = {
        orderAmount,
        orderPaymentMethod
    }

    deliveryList = {
        orderPhoneNumber,
        orderAddress,
    }

    $.ajax({
        method: 'POST',
        url: '/order/checkout',
        data: { list, paymentList, deliveryList },
    })
    list.reverse()
    addToGrid(list)
}
