const Block = require('./block')
const { GENESIS_DATA } = require('./config')

describe('Block', () => {
  const timestamp = 'a-date'
  const lasthash = 'foo-hash'
  const hash = 'bar-hash'
  const data = ['blockchain', 'data']
  const block = new Block({
    timestamp,
    lasthash,
    hash,
    data
  })

  it('has a timestamp, a lasthash, hash and data property', () => {
    expect(block.timestamp).toEqual(timestamp)
    expect(block.lasthash).toEqual(lasthash)
    expect(block.hash).toEqual(hash)
    expect(block.data).toEqual(data)
  })

  describe('genesis()', () => {
    const genesisBlock = Block.genesis()

    it('returns a Block Instance', () => {
      expect(genesisBlock instanceof Block).toBe(true)
    })

    it('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA)
    })
  })

  describe('mineBlock()', () => {
    const lastBlock = Block.genesis()
    const data = 'mined data'
    const minedBlock = Block.mineBlock({ lastBlock, data })

    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true)
    })
    it('sets the lasthash to be the has of the lastBlock', () => {
      expect(minedBlock.lasthash).toEqual(lastBlock.hash)
    })

    it('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data)
    })

    it('sets the `timestamp`', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined)
    })
  })
})
