import express from 'express'
import async from 'async';
import * as database from './Database'
import * as face from './Face'
import '@tensorflow/tfjs-node'
import fs from 'fs'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.listen(3000, () => {
    init()
    console.log(`Example app listening on port 3000!`)
  }
)

let init = () => {
  const tasks = [database.initDB, face.loadModel, face.populateRegisteredMembersDescriptors]
  
  async.series(tasks, function (err, results) {
    console.log(results); 
  });
}

app.post('/recognition', (req, res) => {
  face.recognize(req, res)
})

app.post('/members', async (req, res) => {
  await face.trainData(req, res)
})

app.get('/members', (req, res) => {
  face.getRegisteredData(res)
})

app.get('/members/:id', (req, res) => {
    face.getRegisteredData(res, req.params.id)
})

app.get('/answeryes', (req, res) => {
    append('yes\n', res)
  })
  
app.get('/answerno', (req, res) => {
  append('no\n', res)
})

app.get('/attendances', (req, res) => {

})

function append(msg :string, res :any) {
  fs.appendFile(msg+'.txt', msg, function (err) {
    if (err) throw err
      res.send('saved')
  })
}
