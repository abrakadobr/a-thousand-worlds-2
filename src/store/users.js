/** Vuex module for users collection */
import * as slugify from '@sindresorhus/slugify'
import firebase from '@/firebase'
import collectionModule, { firebaseGet } from './modules/collection'
import mergeOne from '@/util/mergeOne'

const module = mergeOne(collectionModule('users'), {
  actions: {

    // saves a new contributor user profile that is not attached to a login and cannot be authenticated
    // useful for manually adding contributor information to books that are already in the directory when the contributor doesn't have an account yet
    async saveContributor(ctx, profile) {

      if (!profile.name) {
        throw new Error('User name required')
      }

      const uid = slugify(profile.name)
      const newUserPath = `users/${uid}`

      // to be safe, make sure a user has not already been created with the same name
      const user = await firebaseGet(newUserPath)
      if (user) {
        console.error('User exists:', user)
        throw new Error(`User '${profile.name}' already exists`)
      }

      await firebase.database().ref(newUserPath).set({
        profile: {
          ...profile,
          noLogin: true,
        },
        roles: {
          contributor: true,
        },
      })

      return uid

    },

  }
})

export default module
