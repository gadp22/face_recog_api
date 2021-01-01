import fs from 'fs'

export function print(msg : any) {
    log(msg)
}

export function printErr(msg : any) {
  err(msg)
}

export function consol(msg : any) {
    log(msg)
    console.log(msg)
}

function log(msg : any) {
    var message 
    
    message = new Date(Date.now()).toUTCString() + " " + msg + "\n"

    fs.appendFile('log', message, function (err) {
      if (err) throw err
        
    })
  }

function err(msg : any) {
    var message 
    
    message = new Date(Date.now()).toUTCString() + " " + msg + "\n"

    fs.appendFile('error_log', message, function (err) {
      if (err) throw err
    })
  }