const target = require('../../src/summary/index');

describe('summary test', () => {
  describe('func _payoff', () => {
    test('adam borrow to bob', () => {
      const datas = [{ 
        parent: 'adam',
        method: 'borrow',
        amount: 1000,
        children: ['bob'] 
      }]

      const users = ['adam', 'bob']

      target.payoff(datas, users).then(summary => {
        const ans = {
          adam: {
            adam: 0,
            bob: 1000
          },
          bob: {
            adam: -1000,
            bob: 0
          }
        }
        expect(summary).toEqual(ans)
      })
    })
  })
})