'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

class ScaffoldProvider extends ServiceProvider {
  constructor () {
    super()
    this.generators = ['Scaffold']
  }

  * register () {
    this.generators.forEach((generator) => {
      this.app.bind(`Adonis/Generators/Make:${generator}`, (app) => {
        const Helpers = app.use('Adonis/Src/Helpers')
        const Generator = require(`../src/Generators/${generator}`)
        return new Generator(Helpers)
      })
    })
  }
}

module.exports = ScaffoldProvider
