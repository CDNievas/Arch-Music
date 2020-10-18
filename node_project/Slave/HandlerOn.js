
const Handler = require("./Handler");

class HandlerOn extends Handler{

    handle(discClient){
        discClient.on("ready", () => {
            this.printInicial();                        
        });
    }

    printInicial(){
        console.log("Arch Music DJ Slave by CDNievas");
    }

}

module.exports = HandlerOn
