const input = document.querySelector('#productname')
const quantity = document.querySelector('#quantity')
const checkoutBtn = document.querySelector('#checkoutBtn')
const form = document.querySelector('#searchform')
const table = document.querySelector('#list')
const addButton = document.querySelector('#addButton')
const list = []
let foundProducts = []

checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    checkOut(list)
})

input.addEventListener('input', () => {
    $.ajax({
        method: "GET",
        url: "/order/search",
        data: { search: input.value },
        success: function (data) {
            getProduct(data)
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
        $('#quantity').unbind().bind('keyup', function (event) {
            if (event.key != "Enter") return
            event.preventDefault();
            product['ordered'] = quantity.value
            list.push(product)
            addToGrid(list)
            input.value = ""
            quantity.value = ""
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
        var row = table.insertRow(1);

        var productName = row.insertCell(0);
        var productManufacturer = row.insertCell(1);
        var quantity = row.insertCell(2);
        var price = row.insertCell(3);
        var total = row.insertCell(4)

        productName.innerHTML = product['name']
        productManufacturer.innerHTML = product['manufacturer']
        quantity.innerHTML = product['ordered']
        price.innerHTML = product['price']
        total.innerHTML = product['ordered'] * product['price'];
    }
}

function checkOut(list) {
    $.ajax({
        method: 'POST',
        url: '/order/checkout',
        data: { list: list },
    })
    list = []
    addToGrid(list)
} 