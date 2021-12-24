const nameInput = document.querySelector('#productname')
const quantityInput = document.querySelector('#quantity')
const priceInput = document.querySelector('#price')
const manufacturerInput = document.querySelector('#manufacturer')
const list = []

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
            console.log(list)
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

        productName.innerHTML = product['name']
        productManufacturer.innerHTML = product['manufacturer']
        productPrice.innerHTML = product['price']
        productQuantity.innerHTML = product['importQuantity'] || `<div contenteditable id="productQuantity${i}" onInput="assignQuantity(${i})"></div>`
    }
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
            url: "/warehouse/import",
            data: { list },
        })
    }
})

function assignQuantity(i) {
    console.log(list[i])
    list[i]['importQuantity'] = parseInt(document.querySelector(`#productQuantity${i}`).innerHTML)
}