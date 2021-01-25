const functions = require('firebase-functions')
const coverImageByISBN = require('./coverImageByISBNServer')
const email = require('./email')
const metadataByISBN = require('./metadataByISBN')
const searchISBN = require('./searchISBN')
const watchBookSubmissions = require('./watchBookSubmissions')
const watchBooksCreate = require('./watchBooks/onCreate')
const watchBooksUpdate = require('./watchBooks/onUpdate')
const watchBooksDelete = require('./watchBooks/onDelete')
const watchUsers = require('./watchUsers')

exports.coverImageByISBN = functions
  .https.onRequest(coverImageByISBN())

exports.email = functions
  .https.onRequest(email())

exports.metadataByISBN = functions
  .https.onRequest(metadataByISBN())

// increase function memory since we are doing image processing
// https://firebase.google.com/docs/functions/manage-functions#set_timeout_and_memory_allocation

exports.searchISBN = functions
  .runWith({ memory: '1GB' })
  .https.onRequest(searchISBN())

exports.watchBookSubmissions = watchBookSubmissions

exports.watchBooksCreate = watchBooksCreate
exports.watchBooksUpdate = watchBooksUpdate
exports.watchBooksDelete = watchBooksDelete

exports.watchUsers = watchUsers
