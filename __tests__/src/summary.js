const target = require('../../src/summary/index');

describe('summary test', () => {
  describe('func _payoff', () => {
    test('adam borrow to bob', () => {
      const datas = [
        { 
          parent: 'adam',
          method: 'borrow',
          amount: 1000,
          children: ['bob'] 
        }
      ]

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

    test('adam borrow to bob and bob borrow to adam', () => {
      const datas = [
        { 
          parent: 'adam',
          method: 'borrow',
          amount: 1000,
          children: ['bob'] 
        },
        {
          parent: 'bob',
          method: 'borrow',
          amount: 1000,
          children: ['adam']
        }
      ]

      const users = ['adam', 'bob']

      target.payoff(datas, users).then(summary => {
        const ans = {
          adam: {
            adam: 0,
            bob: 0
          },
          bob: {
            adam: 0,
            bob: 0
          }
        }
        expect(summary).toEqual(ans)
      })
    })

    test('adam dutch with bob and carol', () => {
      const datas = [
        { 
          parent: 'adam',
          method: 'dutch',
          amount: 3000,
          children: ['adam', 'bob', 'carol'] 
        }
      ]

      const users = ['adam', 'bob', 'carol']

      target.payoff(datas, users).then(summary => {
        const ans = {
          adam: {
            adam: 0,
            bob: 1000,
            carol: 1000
          },
          bob: {
            adam: -1000,
            bob: 0,
            carol: 0
          },
          carol: {
            adam: -1000,
            bob: 0,
            carol: 0
          }
        }
        expect(summary).toEqual(ans)
      })
    })
  })
})