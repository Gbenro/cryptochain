class Block {
  constructor ({ timestamp, lasthash, hash, data }) {
    this.timestamp = timestamp
    this.lasthash = lasthash
    this.hash = hash
    this.data = data
  }
}
module.exports = Block

const block1 = new Block({
  timestamp: '01/01/01',
  lasthash: 'foo-lastHash',
  hash: 'foo-hash',
  data: 'foo-data'
})
console.log('block 1', block1)
