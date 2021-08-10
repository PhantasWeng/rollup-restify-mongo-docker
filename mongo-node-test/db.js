import mongodb from 'mongodb'

const uri = 'mongodb://root:example@localhost:27017?retryWrites=true&writeConcern=majority'
const client = new mongodb.MongoClient(uri)

async function initialize() {
  await client.connect()
  client.close()
}

async function getUser(userName) {
  try {
    await client.connect()
    const database = client.db('mongo-node-test')
    const users = database.collection('users')
    const query = { name: {
      $regex: userName,
      $options: 'i'
    } }
    const user = await users.findOne(query)
    return user
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}

initialize()

export default {
  getUser
}