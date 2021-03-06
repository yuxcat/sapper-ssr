import { db } from './firebase'
import { throttle } from '../utils'
import { readable } from 'svelte/store'

export function collection(ref, query) {
  // If ref was passed as a string then
  // treat it as a collection path.
  if (typeof ref === 'string') ref = db.collection(ref)

  // If no query was given then the collection
  // reference can function as a query too.
  if (!query) query = ref

  /**
   * This block of code creates a readable Svelte store,
   * which subscribes itself to Firestore's live updating snapshots.
   *
   * And whenever a new snapshot comes in, we wrap every document in it
   * in a proxy, so that whenever we change a property on a document,
   * that change is then automatically sent back to Firestore.
   *
   * Finally we also add a delete method to every document,
   * for complete crud control.
   */
  const store = readable([], (set) => {
    const unsubscribe = query.onSnapshot((snapshot) =>
      set(
        snapshot.docs.map((doc) => {
          const update = throttle(
            (target) => {
              const data = {
                ...target,
                updated: new Date(),
              }

              delete data.id

              doc.ref.update(data)
            },
            100,
            500
          )

          return new Proxy(
            { id: doc.id, ...doc.data() },
            {
              get(target, prop, receiver) {
                return prop === 'delete'
                  ? doc.ref.delete.bind(doc.ref)
                  : Reflect.get(...arguments)
              },
              set(target, prop, newValue) {
                Reflect.set(...arguments)
                update(target)
                return true
              },
            }
          )
        })
      )
    )

    return () => unsubscribe()
  })

  // We also add an `add` method to our store,
  // which forwards the call to the firestore collection reference.
  store.add = (doc) => ref.add({ created: new Date(), ...doc })

  /**
   * Finally we wrap the entire store in another proxy.
   * The purpose of this proxy is that you can build queries with the store.
   * And that for every additional query method you just get back a new Svelte store.
   */
  return new Proxy(store, {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(...arguments)
      }

      if (prop in query && typeof query[prop] === 'function') {
        const queryFunc = Reflect.get(query, prop, receiver).bind(query)

        return function () {
          const newQuery = queryFunc(...arguments)

          return collection(ref, newQuery)
        }
      }
    },
  })
}

export const preloader = (store) => ({ params }) =>
  new Promise((resolve) =>
    store.subscribe((data) => data.length && resolve(params))
  )