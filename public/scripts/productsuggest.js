const nameInput = document.querySelector('#productname')
const quantityInput = document.querySelector('#quantity')
const priceInput = document.querySelector('#price')
const manufacturerInput = document.querySelector('#manufacturer')

const list = []
let exportList = {}

nameInput.addEventListener('input', (e) => {
    $.ajax({
        method: "GET",
        url: "/product/search",
        data: { search: nameInput.value },
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
        select: async function (e, ui) {
            const product = await fetchData(ui)
            delete product['result']['quantity']
            list.push(product['result'])
            clearForm()
            fillTable()
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

function fillTable() {
    const table = document.querySelector('#list')
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    for (let i = 0; i < list.length; i++) {
        const product = list[i]
        const row = table.insertRow(1)

        let productName = row.insertCell(0)
        let productManufacturer = row.insertCell(1)
        let productQuantity = row.insertCell(2)
        let productPrice = row.insertCell(3)
        let productTotal = row.insertCell(4)
        let buTon = row.insertCell(5)

        productName.innerHTML = product['name']
        productManufacturer.innerHTML = product['manufacturer']
        productPrice.innerHTML = product['price']
        productQuantity.innerHTML = product['importQuantity'] || `<div contenteditable id="productQuantity${i}" onInput="assignQuantity(${i})"></div>`
        buTon.innerHTML = `<button onclick="removeProduct(${i})" class="btn btn-danger">Delete</button>`
    }
    calc()
}

const productForm = document.querySelector('#productForm')
productForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const newProduct = {
        name: nameInput.value,
        importQuantity: parseInt(quantityInput.value),
        price: parseFloat(priceInput.value),
        manufacturer: manufacturerInput.value
    }
    list.push(newProduct)
    fillTable()
    clearForm()
})

function clearForm() {
    nameInput.value = ''
    quantityInput.value = ''
    priceInput.value = ''
    manufacturerInput.value = ''
}

document.querySelector('#importBtn').addEventListener('submit', (e) => {
    e.preventDefault()
    if (!list.length) {
        return
    }
    else {
        $.ajax({
            method: "POST",
            url: "/accountant/warehouse/import",
            data: { list },
        }).done(() => {
            window.location.href = "/accountant/warehouse"
        })
    }
})

function assignQuantity(i) {
    list[i]['importQuantity'] = parseInt(document.querySelector(`#productQuantity${i}`).innerHTML)
    calc()
}

function calc() {
    const table = document.querySelector('#list')
    list.reverse()
    total = 0
    for (let i = 0; i < list.length; i++) {
        product = list[i]
        cost = (product['importQuantity'] * product['price']).toFixed(2)
        table.rows[i + 1].cells[4].innerHTML = cost
    }
    list.reverse()
}

function removeProduct(i) {
    list.splice(i, 1)
    fillTable()
}


function changeRequestType() {
    const value = document.querySelector('#requestType').value
    if (value === "import") {
        document.querySelector('#importForm').style.display = "initial"
        document.querySelector('#exportForm').style.display = "none"
    }
    else if (value === "export") {
        document.querySelector('#importForm').style.display = "none"
        document.querySelector('#exportForm').style.display = "initial"
    }
}

async function fillExportRequest(id) {
    const result = await $.ajax({
        method: "GET",
        url: "/retailer/order/detail",
        data: { id },
    })

    const order = result.order
    const detail = `<span><b>Retailer's name: </b>${order.retailer_id.fullname}</span>
                    <br>
                    <span><b>Order date:</b> ${order.orderDate}</span>
                    &#160 &#160
                    <span><b>Payment method:</b> ${order.payment.method}</span>
                    <br>
                    <span><b>Delivery address:</b> ${order.delivery.address}</span>
                    &#160 &#160
                    <span><b>Phone number:</b> ${order.delivery.phonenumber}</span>`

    exportList = order;

    document.querySelector('#orderDetail').innerHTML = detail
    fillExportTable()
}

function fillExportTable() {
    const table = document.querySelector('#list2')
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    const products = exportList.product
    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        // console.log(product)
        const row = table.insertRow(1)

        let productName = row.insertCell(0)
        let productManufacturer = row.insertCell(1)
        let productPrice = row.insertCell(2)
        let productWarehouseQuantity = row.insertCell(3)
        let productExportQuantity = row.insertCell(4)
        let productTotal = row.insertCell(5)

        console.log(products)

        productName.innerHTML = product.item['name']
        productManufacturer.innerHTML = product.item['manufacturer']
        productPrice.innerHTML = product.item['price']
        productWarehouseQuantity.innerHTML = product.item['quantity']
        productExportQuantity.innerHTML = product['orderedQuantity']
        productTotal.innerHTML = (product.item['price'] * product['orderedQuantity']).toFixed(2)
    }
}

document.querySelector("#exportBtn").addEventListener('submit', (e) => {
    e.preventDefault()
    $.ajax({
        method: "POST",
        url: "/accountant/warehouse/export",
        data: { exportList },
        success: function (data) {
            location.href = '/accountant/warehouse'
        }
    })
})