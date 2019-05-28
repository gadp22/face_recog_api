import 'mongodb'
import 'dotenv/config';
import './Face'
import { populateRegisteredMembersDescriptors } from './Face';

const ObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const dbName = 'face'
const url = 'mongodb://' + process.env.DBHOST + ':' + process.env.DBPORT
const client = new MongoClient(url)

var db :any

export const initDB = async () => {
    client.connect(function() {
    console.log("Connected successfully to the database server");
  
    db = client.db(dbName);
  });
}

export const insertDocuments = (data :any) => {
  const collection = db.collection('descriptors')

  collection.insertOne(data, function(err :any, result :any) {
      console.log(err)
      populateRegisteredMembersDescriptors()
  })
}

export const findAllDocuments = (...id :any) => {
  const collection = db.collection('descriptors')

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
  })
}
