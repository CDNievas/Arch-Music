
const Handler = require("./Handler");

class HandlerProcess extends Handler{

    handle(process){

        process.on('message', message => {
            console.log('message from parent:', message);
        });

        this.process.on("exit", function(code,signal){
            console.log("Exit " + code + "-" + signal);
        });
        
        this.process.on("uncaughtException", (err) => {
            console.error(err);
            process.exit(1);
        });
    }

}

module.exports = HandlerProcess
