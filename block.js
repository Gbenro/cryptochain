class Block {
  constructor ({ timestamp, lasthash, hash, data }) {
    this.timestamp = timestamp
    this.lasthash = lasthash
    this.hash = hash
    this.data = data
  }
}
module.exports = Block
