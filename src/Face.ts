import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons'
import * as database from './Database'
import * as faceapi from 'face-api.js'
import '@tensorflow/tfjs-node'
import fs, { fstatSync } from 'fs'
import 'dotenv/config'
import * as log from './Logger'
import { LayersModel } from '@tensorflow/tfjs-node'

var registeredMembers :any = []
var globalFaceMatcher : faceapi.FaceMatcher

export const populateRegisteredMembersDescriptors = async (callback : any) => {
  log.consol('populating all registered members ...')

  let findReferences = database.findAllDocuments()
  
  findReferences.then(function(object : any) {
    populateDescriptors(object)
  })
  
  callback(log.consol('all registered members have been successfully loaded ...'))
}

const populateDescriptors = async (referenceObject : { [key :string] :any }) => {
  
  let registeredMemberDescriptor : { [key :string] : any } = []
  let labeledDescriptors = []

  for (let i = 0, len = referenceObject.length; i < len; i++) {
    let registeredMember : any = {}
    let descriptors = []

    for (var j in referenceObject[i].descriptors) {
      descriptors.push(referenceObject[i].descriptors[j])
    }

    registeredMember['descriptors'] = new Float32Array(descriptors)
    registeredMember['data'] = referenceObject[i]

    registeredMembers.push(registeredMember)

    if(!registeredMemberDescriptor[referenceObject[i]['name']]) {
      registeredMemberDescriptor[referenceObject[i]['name']] = []
    }

    registeredMemberDescriptor[referenceObject[i]['name']].push(new Float32Array(descriptors))
  }

  for (let key in registeredMemberDescriptor) {
    labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(key, registeredMemberDescriptor[key]))
  }

  globalFaceMatcher = new faceapi.FaceMatcher(labeledDescriptors)

  console.log(globalFaceMatcher)
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
        let imageResult = await faceapi.detectSingleFace(imageElement, faceDetectionOptions).withFaceLandmarks().withFaceDescriptor()
        let faceMatcher = await new faceapi.FaceMatcher(imageResult) 

        log.consol(imageElement)
  
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

  let faceDescriptor = []
  let response :any = {}
  let data :any = {}

  try {
    let imageSource = req.body.faceDescriptor

    for (let i in imageSource) {
      faceDescriptor.push(imageSource[i])
    }

    const bestMatch = globalFaceMatcher.findBestMatch(new Float32Array(faceDescriptor))

    log.print("face recognized : " + bestMatch.label)

    response['status'] = '1'
    response['message'] = 'success.'

    data['name'] = bestMatch.label
    data['distance'] = bestMatch.distance

    database.checkIn(bestMatch.label)
    
    response['data'] = data

    res.send(JSON.stringify(response))
  } catch (err) {
    res.sen(JSON.stringify(err))
  }
}