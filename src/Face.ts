import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons'
import * as database from './Database'
import * as faceapi from 'face-api.js'
import '@tensorflow/tfjs-node'
import fs, { fstatSync } from 'fs'
import 'dotenv/config'
import * as log from './Logger'

var registeredMembers :any = []

export const populateRegisteredMembersDescriptors = async (callback :any) => {
  log.consol('populating all registered members ...')

  let findReferences = database.findAllDocuments()
  
  await findReferences.then(function(imageReferences) {
    type Dict = { [key :string] :any }
    const object :any = imageReferences
    const referenceObject :Dict = object

    for (let i = 0, len = referenceObject.length; i < len; i++) {
      let registeredMember :any = {}
      
      let descriptors = []

      for (var j in referenceObject[i].descriptors) {
        descriptors.push(referenceObject[i].descriptors[j])
      }

      registeredMember['descriptors'] = new Float32Array(descriptors)
      registeredMember['data'] = referenceObject[i]

      registeredMembers.push(registeredMember)
    }
  })
  
  callback(log.consol('all registered members have been successfully loaded ...'))
}

export const loadModel = async (callback :any) => {

    log.consol('loading model for face detection ...')
    await faceDetectionNet.loadFromDisk(process.env.WEIGHTS)
    
    log.consol('loading model for face landmark ...')
    await faceapi.nets.faceLandmark68Net.loadFromDisk(process.env.WEIGHTS)
    
    log.consol('loading model for face recognition ...')
    await faceapi.nets.faceRecognitionNet.loadFromDisk(process.env.WEIGHTS)
  
    callback(log.consol('all models have been successsfully loaded!'))
}

export const getRegisteredData = (res :any, ...args :any) => {
  log.print('getting registered data ...')
  let findReferences :any
  
  if (args.length > 0) {
    findReferences = database.findAllDocuments(args[0])
  } else {
    findReferences = database.findAllDocuments()
  }

  findReferences.then(function(imageReferences :any) {
      type Dict = { [key :string] :any }
      const referenceObject :Dict = imageReferences

      let response :any = {}

      response['status'] = '1'
      response['message'] = 'success.'
      response['data'] = referenceObject

      res.send(JSON.stringify(response))
  })
}

export const getAttendanceData = (res :any, ...args :any) => {
  log.print('getting attendance data ...')
  let attendances :any = database.findAllAttendances()

  attendances.then(function(ref :any) {
      type Dict = { [key :string] :any }
      const referenceObject :Dict = ref

      let response :any = {}

      response['status'] = '1'
      response['message'] = 'success.'
      response['data'] = referenceObject

      res.send(JSON.stringify(response))
  })
  
}

/**
 * Saving image sample to the DB
 * @param imageBuffer base64 jpeg
 * @param name
 */
let saveImageFile = (imageBuffer :string, name :string) => {
  log.print('saving image ...')

  return new Promise(function (resolve, reject) {
    let base64Data = imageBuffer.replace(/^data:image\/jpeg;base64,/, "")
    let directory = process.env.IMAGE_ASSETS + name
    let fileName = directory + '/' + name + '.jpg'

    let image :any = {}

    image['buffer'] = base64Data
    image['uri'] = fileName

    fs.promises.mkdir(directory, { recursive: true }).catch(console.error)

    fs.writeFile(fileName, base64Data, 'base64', function(err :any) {
      if (err) {
        reject(err)
      }
      
      resolve(image)
    })
  })
}

export const trainData = (req :any, res :any) => {
  log.consol('training new data ...')

  let jsonData :any = {}

  let bodyImage = req.body['image']
  let bodyName = req.body['name']

  if (bodyImage && bodyName) {
    try {
      let imageBuffer = bodyImage
      let imageName = bodyName
  
      saveImageFile(imageBuffer, imageName).then(async function (image :any) {
        jsonData['name'] = imageName
        jsonData['image'] = image['buffer']
        
        //single 
        let imageElement = await canvas.loadImage(image['uri'])
        let imageResult = await faceapi.detectAllFaces(imageElement, faceDetectionOptions).withFaceLandmarks().withFaceDescriptors()
        let faceMatcher = await new faceapi.FaceMatcher(imageResult) 

        log.consol(imageElement)
        console.log(imageResult)
  
        jsonData['descriptors'] = await faceMatcher.labeledDescriptors[0].descriptors[0]

        database.insertDocuments(jsonData)
  
        log.consol('done, saved results to the database.')
      })
      
    } catch (err) {
       log.consol(err)
    }
  }
}

export const recognize = async(req :any, res :any) => {
  log.consol('recognizing ...')

  var minDistance = 99
  var recognition :any = null

  const unknown :string = 'unknown'

  let faceDescriptor = []
  let faceDescriptorArray = []
  let response :any = {}
  let data :any = {}

  try {
    let imageSource = req.body.faceDescriptor

    for (let i in imageSource) {
      faceDescriptor.push(imageSource[i])
    }

    faceDescriptorArray.push(new Float32Array(faceDescriptor))

    let labeledDescriptors = new faceapi.LabeledFaceDescriptors('person', faceDescriptorArray)
    let faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.45) 

    for (let i = 0, len = registeredMembers.length; i < len; i++) {
      let ref = registeredMembers[i].data
      let result :any = faceMatcher.findBestMatch(registeredMembers[i].descriptors)

      if (result._label != unknown && result.distance < minDistance) {
        minDistance = result.distance
        recognition = ref
      }
    }

    if (recognition == null) {
      response['status'] = '0'
      response['message'] = 'error, unregistered member.'
      
      data['name'] = unknown
      data['distance'] = minDistance
    } else {
      log.print("face recognized : " + recognition.name)

      response['status'] = '1'
      response['message'] = 'success.'

      data['id'] = recognition._id
      data['name'] = recognition.name
      data['distance'] = minDistance

      //checkin

      let id :any = recognition._id

      database.checkIn(id)
    }
    response['data'] = data

    res.send(JSON.stringify(response))
    } catch (err) {
      log.consol(err)
    }
  }