import 'mongodb'
import 'dotenv/config';
import './Face'
import { populateRegisteredMembersDescriptors } from './Face';
import { exp } from '@tensorflow/tfjs-node';
import * as log from './Logger'

const ObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const dbName = 'face'
const url = 'mongodb://' + process.env.DBHOST + ':' + process.env.DBPORT
const client = new MongoClient(url)

var db : any

export const initDB = async (callback : any) => {
    client.connect(function() {
    db = client.db(dbName);
    callback(console.log('Connected successfully to the database server'))
  });
}

export const insertDocuments = (data : any) => {
  log.print("inserting documents ...")

  db.collection('descriptors').insertOne(data, function(err :any, result :any) {
      console.log(err)
      populateRegisteredMembersDescriptors
  })
}

export const findAllDocuments = async (...id : any) => {
  return new Promise(function(resolve, reject) {
    if (id.length > 0) {
      db.collection('descriptors').findOne({'_id': new ObjectID(id[0])}, function(err :any, docs :any) {          
          if (err) {
            log.printErr(err)
            return reject(err)
        }
            return resolve(docs)
      })
    } else {
      db.collection('descriptors').find().toArray( function(err :any, docs :any) {
       if (err) {
          log.printErr(err)
          return reject(err)
       }
          return resolve(docs)
      })
    }
  })
}

export const findAllAttendances = async () => {
  return new Promise(function(resolve, reject) {
    db.collection('attendances').find().sort({_id: -1}).toArray( function(err :any, docs :any) {
      if (err) {
         log.printErr(err)
         return reject(err)
      }
         return resolve(docs)
     })
  })
}

const updateAttendance = async (data : any) => {
  return new Promise(function(resolve, reject) {
  db.collection('attendances').insertOne(data, function(err :any, result :any) {
    if (err) {
        log.printErr(err)
        return reject(err)
    }
        return resolve(result)
    })
  })
}

export const checkIn = async (id : any) => {
  log.print("checking in ...")

  return new Promise(function(resolve, reject) {
    findAllDocuments(id).then(
      function(object : any) {
        updateCheckIn(object)
      },
      function(error) {
        log.printErr(error)
      }
    )
  })
}

function updateCheckIn(object : any) {
  let date = new Date(Date.now()).toUTCString()
  type Dict = { [key :string] :any }
  const member :Dict = object
  let data : any = {}
  
  data['member_id'] = object['_id']
  data['date'] = date
  data['name'] = member['name']

  let query = { date: {$regex: "^" + date.substring(0,15)}, member_id: data['member_id']}

  db.collection('attendances').find(query).toArray(function(err :any, result :any) {

    if (err) {
      log.printErr(err)
    }
    
    if (result.length == 0) {
      log.print("checking in: " + data['name'])
      data['status'] = 0
      updateAttendance(data)
    } else if (result.length == 1) {
      log.print("checking out: " + data['name'])
      data['status'] = 1
      updateAttendance(data)
    } else {
      log.print("updating check out: " + data['name'])
      let attendant = result.find((x :any) => x.status === 1)

      db.collection('attendances').updateOne({ '_id': attendant['_id'] }, {$set: {'date': date}}, function (err :any, result :any) {
        if (err) {
          log.printErr(err)
        }
      })
    }
  })
}