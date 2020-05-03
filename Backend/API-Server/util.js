

    function mail(transport, options){
        return new Promise((resolve, reject) =>{
            transport.sendMail(options, (err, response) =>{
                return err ? reject(err) : resolve(response);
            })
        })
    }
module.exports = {mail}

