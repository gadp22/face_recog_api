import 'mongodb'
import 'dotenv/config';
import './Face'
import { populateRegisteredMembersDescriptors } from './Face';
import { exp } from '@tensorflow/tfjs-node';

const ObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const dbName = 'face'
const url = 'mongodb://' + process.env.DBHOST + ':' + process.env.DBPORT
const client = new MongoClient(url)

var db :any

export const initDB = async (callback :any) => {
    client.connect(function() {
    db = client.db(dbName);
    callback(console.log('Connected successfully to the database server'))
  });
}

export const insertDocuments = (data :any) => {
  console.log("inserting documents")

  db.collection('descriptors').insertOne(data, function(err :any, result :any) {
      console.log(err)
      populateRegisteredMembersDescriptors
  })
}

export const findAllDocuments = (...id :any) => {
  return new Promise(function(resolve, reject) {
    if (id.length > 0) {
      db.collection('descriptors').findOne({'_id': new ObjectID(id[0])}, function(err :any, docs :any) {          
          if (err) {
            return reject(err)
        }
            return resolve(docs)
      })
    } else {
      db.collection('descriptors').find().toArray( function(err :any, docs :any) {
       if (err) {
          return reject(err)
       }
          return resolve(docs)
      })
    }
  })
}

export const getAttendanceData = (id :any) => {
  return new Promise(function(resolve, reject) {
    db.collection('attendances').findOne({'_id': new ObjectID(id[0])}, function(err :any, docs :any) {          
      if (err) {
          return reject(err)
      }
          return resolve(docs)
     })
  })
}

export const findAttendances = (...id :any) => {
  /*const collection = db.collection('descriptors')

  return new Promise(function(resolve, reject) {

    if (id.length > 0) {
      collection.findOne({'_id': new ObjectID(id[0])}, function(err :any, docs :any) {          
          if (err) {
            return reject(err)
        }
            return resolve(docs)
      })
    }

    collection.find().toArray( function(err :any, docs :any) {
     if (err) {
        return reject(err)
     }
        return resolve(docs)
    })
  })*/
}

const updateAttendance = (data :any) => {
  db.collection('attendances').insertOne(data, function(err :any, result :any) {
    console.log(err)
  })
}

export const checkIn = (id :any) => {
  let data :any = {}
  let date = new Date(Date.now()).toUTCString()

  let query = { date: {$regex: "^" + date.substring(0,15)}}

  data['member_id'] = id
  data['date'] = date

  db.collection('attendances').find(query).toArray(function(err :any, result :any) {
    if (err) throw err
    
    if (result.length == 0) {
      data['status'] = 0
      updateAttendance(data)
    } else if (result.length == 1) {
      data['status'] = 1
      updateAttendance(data)
    } else {
      let attendant = result.find((x :any) => x.status === 1)

      db.collection('attendances').updateOne({ '_id': attendant['_id'] }, {$set: {'date': date}}, function (err :any, result :any) {
          console.log(err)
      })
    }
  })
}