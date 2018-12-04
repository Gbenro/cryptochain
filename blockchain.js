const Block = require('./block')
const cryptoHash = require('./crypto-hash')

class Blockchain {
  constructor () {
    this.chain = [Block.genesis()]
  }

  addBlock ({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    })
    this.chain.push(newBlock)
  }

  replaceChain (chain) {
    if (chain.length <= this.chain.lenght) {
      console.error('The incoming chain must be longer')
      return
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain must be valid')
      return
    }
    console.log('Replacing chain with', chain)
    this.chain = chain
  }

  static isValidChain (chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lasthash, hash, nonce, difficulty, data } = chain[i]

      const actualLastHash = chain[i - 1].hash
      const lastDifficulty = chain[i - 1].difficulty

      if (lasthash !== actualLastHash) return false

      const validatedHash = cryptoHash(
        timestamp,
        lasthash,
        nonce,
        difficulty,
        data
      )
      if (hash !== validatedHash) return false
      if (Math.abs(lastDifficulty - difficulty) > 1) return false
    }
    return true
  }
}

module.exports = Blockchain
