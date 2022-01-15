function getData(month) {
    return $.ajax({
        method: "GET",
        url: "/accountant/revenue/imports/get",
        data: { month: month },
        success: function (data) {
            fillData(data['result'])
        }
    })
}

async function fillData(data) {
    const imports = data
    const table = document.querySelector("#list")
    let totalPrice = 0

    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    for (let i = 0; i < imports.length; i++) {
        let newRow = table.insertRow(i + 1)

        let importId = newRow.insertCell(0)
        let importDate = newRow.insertCell(1)
        let importPrice = newRow.insertCell(2)

        let price = 0
        for (let j = 0; j < imports[i].products.length; j++) {
            console.log(imports[i].products[j])
            price += parseInt(imports[i].products[j].item.price) * imports[i].products[j].importQuantity
        }

        importId.innerHTML = imports[i]['_id']
        let date = new Date(imports[i]['importDate'])
        importDate.innerHTML = date.toDateString()
        importPrice.innerHTML = price + '$'

        totalPrice += price
    }
    console.log(totalPrice)
    document.querySelector('#total').innerHTML = 'Total price: ' + totalPrice + '$'
}

const monthChooser = document.querySelector("#monthSelector")
monthChooser.addEventListener('change', () => {
    getData(monthChooser.value)
})

document.querySelector('#importSwitch').addEventListener('change', () => {
    window.location.href = "/accountant/revenue/exports";
})