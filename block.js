const cryptoHash = require('./crypto-hash')
const { GENESIS_DATA, MINE_RATE } = require('./config')

class Block {
  constructor ({ timestamp, lasthash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp
    this.lasthash = lasthash
    this.hash = hash
    this.data = data
    this.nonce = nonce
    this.difficulty = difficulty
  }

  static genesis () {
    return new this(GENESIS_DATA)
  }

  static mineBlock ({ lastBlock, data }) {
    let hash, timestamp

    const lasthash = lastBlock.hash
    const { difficulty } = lastBlock
    let nonce = 0
    do {
      nonce++
      timestamp = Date.now()
      hash = cryptoHash(timestamp, data, lasthash, nonce, difficulty)
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this({
      timestamp,
      lasthash,
      data,
      difficulty,
      nonce,
      hash
    })
  }

  static adjustDifficulty ({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock

    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1
    return difficulty + 1
  }
}
module.exports = Block
