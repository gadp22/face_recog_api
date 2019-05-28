import express from 'express'
import * as database from './Database'
import * as face from './Face'
import '@tensorflow/tfjs-node'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(3000, () => {
    init()
    console.log(`Example app listening on port 3000!`)
  }
)

let init = async () => {
  await database.initDB()
  await face.loadModel()
  await face.populateRegisteredMembersDescriptors()
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