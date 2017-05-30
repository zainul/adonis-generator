'use strict'

const chai = require('chai')
const expect = chai.expect
require('co-mocha')

const Generator = require('../../src/Generators/Base')

describe('Generator', function () {
  it('should make a template name for a given entity', function () {
    const gen = new Generator()
    const controllerName = gen._makeEntityName('userscontroller', 'controller', true)
    expect(controllerName.entityName).to.equal('UsersController')
  })
})
