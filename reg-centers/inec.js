import { Selector } from 'testcafe'
import fs from 'fs'
import path from 'path'
import states from './states'

const statesCaptialized = states.map(state => state.toUpperCase())
const url = 'http://www.inecnigeria.org/?page_id=3085'
const data = {}

fixture('Inec').page(url).after(() => fs
  .writeFile(
    path.join(__dirname, `reg-centers.json`),
    JSON.stringify(data),
    'utf8',
    err => err ? console.log(err.message) : null
  ))

const suite = (state) => test(`Get ${state} State Pdf`, async testCafe => {
  const selector = () => Selector('a').withText(state)
  await testCafe.click(selector())
  const url = await Selector('.attachment').child('a').getAttribute('href')
  data[state.replace('-', ' ')] = url

  return url
})

statesCaptialized.forEach(state => suite(state))
