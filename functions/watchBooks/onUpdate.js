const functions = require('firebase-functions')
const admin = require('firebase-admin')
const coverImageByISBN = require('../util/coverImageByISBN')
const loadImage = require('../util/loadImage')
const image64ToBuffer = require('../util/image64ToBuffer')
const UUID = require('uuid')

const getDownloadUrl = (fileName, bucketName, token) => `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`

const watchBooks = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB',
  })
  .database.ref('/books/{id}')
  .onUpdate(async (change, context) => {

    const snap = change.after
    const book = snap.val()
    if (book.findingCover === true) {
      console.log('updated on finding cover. no need to do anything here', book.title)
      return
    }

    let cover = book.cover || null
    if (cover && cover.url && cover.url.startsWith('http')) {
      console.log('cover image is ok, no need to do anything.', book.title, book.isbn)
      return
    }

    console.log('onUpdate', book.title)
    await snap.ref.child('findingCover').set(true)
    if (!cover) {
      try {
        cover = await coverImageByISBN(book.isbn, 400)
      }
      catch (err) {
        console.error('coverImageByISBN error', err)
        cover = null
      }
    }
    if (cover && cover.downloadUrl) {
      try {
        cover = await loadImage(cover.downloadUrl, 400)
      }
      catch (err) {
        console.error('loadImage error', err)
        cover = null
      }
    }
    // if image is manually uploaded from administration part - we will have only base64 field, wich we need to convert to direct image binary data for upload to storage
    if (cover && cover.base64 && !cover.buffer) {
      cover = await image64ToBuffer(cover.base64, 400)
    }
    if (cover && cover.buffer) {
      console.log('saving cover from buffer to storage')
      const bucket = admin.storage().bucket()
      const uuid = UUID.v4()
      const fname = `books/${context.params.id}`
      const file = await bucket.file(fname)
      await file
        .save(cover.buffer, {
          metadata: {
            contentType: 'image/png',
            cacheControl: 'public,max-age=31536000',
            metadata: {
              firebaseStorageDownloadTokens: uuid
            }
          }
        })
      const url = getDownloadUrl(fname, bucket.name, uuid)

      await snap.ref.child('cover').set({
        url,
        width: cover.width,
        height: cover.height
      })
      console.log('Book cover saved:', book.title, book.isbn, url)
    }
    else {
      console.log('book processed without cover image', book.title, book.isbn)
    }

    // finanly removing key to unblock book for next updates
    await snap.ref.child('findingCover').remove()
  })

module.exports = watchBooks
