const Blockchain = require('./index')
const Block = require('./block')
const cryptoHash = require('../util/crypto-hash')

describe('Blockchain', () => {
  let blockchain, newChain, originalChain

  beforeEach(() => {
    blockchain = new Blockchain()
    newChain = new Blockchain()
    originalChain = blockchain.chain
  })

  it('contains a `chain` Array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true)
  })

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis())
  })

  it('adds a new block to the chain', () => {
    const newData = 'foo-bar'
    blockchain.addBlock({ data: newData })

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData)
  })

  describe('isValidChain()', () => {
    describe('when the chain does not start with the genesis block', () => {
      it('return false', () => {
        blockchain.chain[0] = { data: 'fake-genesis' }
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
      })
    })
    describe('when the chain starts with the genesis block and has multiple Blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'Bears' })
        blockchain.addBlock({ data: 'Bites' })
        blockchain.addBlock({ data: 'Beerings' })
      })
      describe('and lastHash reference has changed', () => {
        it('returns false', () => {
          blockchain.chain[2].lasthash = 'broken-lasthash'

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })
      describe('and the chain contains a block with a jumped difficulty', () => {
        it('returns false', () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1]
          const lasthash = lastBlock.hash
          const timestamp = Date.now()
          const nonce = 0
          const data = []
          const difficulty = lastBlock.difficulty - 3
          const hash = cryptoHash(timestamp, lasthash, difficulty, nonce, data)
          const badBlock = new Block({
            timestamp,
            lasthash,
            hash,
            nonce,
            difficulty,
            data
          })
          blockchain.chain.push(badBlock)
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })
      describe('and the chain contains a block with an invalid field', () => {
        it('returns false', () => {
          blockchain.chain[2].data = 'some-bad-and-evil-data'
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
        describe('and the chain does not contains any invalid block', () => {
          it('returns true', () => {
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
          })
        })
      })
    })
  })

  describe('replaceChain', () => {
    let errorMock, logMock
    beforeEach(() => {
      errorMock = jest.fn()
      logMock = jest.fn()
      global.console.error = errorMock
      global.console.log = logMock
    })

    describe('when the new chain is not longer', () => {
      beforeEach(() => {
        newChain.chain[0] = { new: 'chain' }

        blockchain.replaceChain(newChain.chain)
      })
      it('does not replace the chain', () => {
        expect(blockchain.chain).toEqual(originalChain)
      })

      it('logs an error', () => {
        expect(errorMock).toHaveBeenCalled()
      })
    })

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'Bears' })
        newChain.addBlock({ data: 'Bites' })
        newChain.addBlock({ data: 'Beerings' })
      })
      describe('and the chain is invalid', () => {
        beforeEach(() => {
          newChain.chain[2].hash = 'some-fake-hash'
          blockchain.replaceChain(newChain.chain)
        })
        it('does not replace the chain', () => {
          expect(blockchain.chain).toEqual(originalChain)
        })
        it('logs an error', () => {
          expect(errorMock).toHaveBeenCalled()
        })
      })
      describe('and the chain is valid ', () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain)
        })
        it('replaces the chain', () => {
          expect(blockchain.chain).toEqual(newChain.chain)
        })
        it('logs about chain replacement', () => {
          expect(logMock).toHaveBeenCalled()
        })
      })
    })
  })
})