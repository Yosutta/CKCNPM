const json = require("./drug-ndc-0001-of-0001.json")
const fs = require('fs')
let products = []

async function deleteThings(){
    for(let i=0;i<json['results'].length;i++){
        let {product_ndc, generic_name, labeler_name, brand_name , ...rest} = json['results'][i]
        if(brand_name && brand_name.length<20){
            let newProduct = {brand_name, labeler_name}
            products.push(newProduct)
        }
    } 

    const seen = new Set();

    const filteredArr = products.filter(el => {
        const duplicate = seen.has(el.brand_name);
        seen.add(el.brand_name);
        return !duplicate;
    });

    fs.writeFileSync("drugs.js", JSON.stringify(filteredArr,null,2), 'utf-8')
}

deleteThings()
