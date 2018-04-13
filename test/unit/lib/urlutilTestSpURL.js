/* global describe, it */
const urlUtil = require('../../../js/lib/urlutil')
const assert = require('assert')

require('../braveUnit')

describe('urlutil', function () {
  describe('isNotUrl', function () {
    it('Has space inside url', function () {
      assert.equal(urlUtil.isURL('https://www.google.ca/search?q=dog cat/'), true)
    })
    it('Has space inside URL and head and back', function () {
      assert.equal(urlUtil.isURL(' https://www.google.ca/search?q=dog cat '), true)
    })
    it('File path with space inside', function () {
      assert.equal(urlUtil.isURL('/Users/kignorc/brave-browser/browser-laptop/dog cat.txt'), true)
    })
    it('file path with space at head and back and inside', function () {
      assert.equal(urlUtil.isURL(' /Users/kignorc/brave-browser/browser-laptop/dog cat.txt '), true)
    })
  })
})
