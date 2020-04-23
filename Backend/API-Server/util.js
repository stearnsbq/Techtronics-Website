var crypt = require('bcrypt');

function gen_date() {
    const now = new Date();

    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function hash_password(plaintext){
    return new Promise((resolve, reject) => {
        crypt.hash(plaintext, 10, (err, hash) =>{
            return err ? reject(err) : resolve(hash);  
        })
    })
}

function compare_password(plaintext, ciphertext){
    return new Promise((resolve, reject) =>{
        crypt.compare(plaintext, ciphertext, (err, hash) =>{
            console.log(hash)
            return resolve(hash)
        })
    })
}

module.exports = {gen_date, hash_password, compare_password}