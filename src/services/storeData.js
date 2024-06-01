const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();

  const userCollection = db.collection('user');
  return userCollection.doc(id).set(data);
}

module.exports = storeData;
