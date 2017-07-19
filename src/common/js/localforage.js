import localforage from 'localforage'

const APPNAME = 'write_english'

var weStore = localforage.createInstance({
  name: APPNAME,
  driver: localforage.INDEXEDDB
})

export default weStore