const json = require("./drug-ndc-0001-of-0001.json")
const fs = require('fs')
let products = []

async function deleteThings(){
    for(let i=0;i<json['results'].length;i++){
        let {product_ndc, generic_name, labeler_name , ...rest} = json['results'][i]
        let newProduct = {generic_name, labeler_name}
        products.push(newProduct)
    } 
    fs.writeFileSync("drugs.js", JSON.stringify(products,null,2), 'utf-8')
}


