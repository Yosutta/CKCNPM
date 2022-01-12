function getData(month) {
    return $.ajax({
        method: "GET",
        url: "/accountant/revenue/exports/get",
        data: { month: month },
        success: function (data) {
            fillData(data['result'])
        }
    })
}

async function fillData(data) {
    const exports = data
    const table = document.querySelector("#list")
    let totalPrice = 0

    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    for (let i = 0; i < exports.length; i++) {
        let newRow = table.insertRow(i + 1)

        let exportId = newRow.insertCell(0)
        let exportRetailerName = newRow.insertCell(1)
        let exportRetailerPhoneNumber = newRow.insertCell(2)
        let exportDate = newRow.insertCell(3)
        let exportPrice = newRow.insertCell(4)

        let price = 0
        for (let j = 0; j < exports[i].products.length; j++) {
            price += parseInt(exports[i].products[j].item.price) * exports[i].products[j].orderedQuantity
        }

        console.log(exports)
        exportId.innerHTML = exports[i]['_id']
        exportRetailerName.innerHTML = exports[i]['order_id']['retailer_id']['fullname']
        exportRetailerPhoneNumber.innerHTML = exports[i]['order_id']['delivery']['phonenumber']
        let date = new Date(exports[i]['exportDate'])
        exportDate.innerHTML = date.toDateString()
        exportPrice.innerHTML = price + '$'

        totalPrice += price
    }
    console.log(totalPrice)
    document.querySelector('#total').innerHTML = 'Total price: ' + totalPrice + '$'
}

const monthChooser = document.querySelector("#monthSelector")
monthChooser.addEventListener('change', () => {
    getData(monthChooser.value)
})

document.querySelector('#exportSwitch').addEventListener('change', () => {
    window.location.href = "/accountant/revenue/imports";
})