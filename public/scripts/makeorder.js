const input = document.querySelector('#productname')
const checkoutBtn = document.querySelector('#checkoutBtn')
const form = document.querySelector('#searchform')
const table = document.querySelector('#list')
const addButton = document.querySelector('#addButton')
const paymentTable = document.querySelector('#paymentForm')

let paymentMethod = 'transaction'
let list = []
let foundProducts = []
let total = 0

checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    checkOut(list)
})

input.addEventListener('input', () => {
    $.ajax({
        method: "GET",
        url: "/product/search",
        data: { search: input.value },
        success: function (daata) {
            getProduct(daata)
        }
    })
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
        url: "/product/detail",
        data: { detail: ui['item']['value'] },
    })
}

async function readData(ui) {
    try {
        const res = await fetchData(ui)
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
        ordered.innerHTML = product['orderedQuantity'] || `<div contenteditable id="orderedQuantity${i}" onInput="assignOrderedQuantity(${i})"></div>`
        price.innerHTML = product['price']
    }
}

function checkOut(list) {
    let orderPhoneNumber = document.querySelector('#deliveryphonenumber').value
    let orderAddress = document.querySelector('#deliveryaddress').value

    let creditCardInfo = {}

    if (paymentMethod === 'transaction') {
        let creditcardname = document.querySelector('#creditcardname').value
        let creditcardnumber = document.querySelector('#creditcardnumber').value
        let creditcarddate = document.querySelector('#creditcarddate').value
        let creditcardzip = document.querySelector('#creditcardzip').value

        creditCardInfo = {
            creditcardname,
            creditcardnumber,
            creditcarddate,
            creditcardzip
        }
    }

    paymentList = {
        orderPaymentMethod: paymentMethod,
        orderAmount: total
    }

    deliveryList = {
        orderPhoneNumber,
        orderAddress,
    }

    console.log(list)
    console.log(paymentList)
    console.log(deliveryList)

    $.ajax({
        method: 'POST',
        url: '/order/checkout',
        data: { list, paymentList, deliveryList, creditCardInfo },
    })
}

function assignOrderedQuantity(i) {
    list[i]['orderedQuantity'] = parseInt(document.querySelector(`#orderedQuantity${i}`).innerHTML)
    calc(list)
}

function calc(list) {
    list.reverse()
    total = 0
    for (let i = 0; i < list.length; i++) {
        product = list[i]
        cost = (product['orderedQuantity'] * product['price']).toFixed(2)
        table.rows[i + 1].cells[5].innerHTML = cost

        total += parseFloat(cost)
        document.querySelector('#totalamount').innerHTML = total
    }
    list.reverse()
}


function changePaymentMethod(value) {
    paymentMethod = value
}