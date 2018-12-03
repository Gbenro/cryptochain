const { GENESIS_DATA } = require('./config')

class Block {
  constructor ({ timestamp, lasthash, hash, data }) {
    this.timestamp = timestamp
    this.lasthash = lasthash
    this.hash = hash
    this.data = data
  }

  static genesis () {
    return new this(GENESIS_DATA)
  }

  static mineBlock ({ lastBlock, data }) {
    return new this({
      timestamp: Date.now(),
      lasthash: lastBlock.hash,
      data
    })
  }
}
module.exports = Block
