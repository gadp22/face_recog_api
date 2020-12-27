import fs from 'fs'

export function print(msg :string) {
    log(msg)
}

export function consol(msg :string) {
    log(msg)
    console.log(msg)
}

function log(msg :string) {
    var message 
    
    message = new Date(Date.now()).toUTCString() + " " + msg + "\n"

    fs.appendFile('log', message, function (err) {
      if (err) throw err
        
    })
  }