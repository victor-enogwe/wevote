import express from 'express'
import { getPollingUnits, getRegCenters } from '../controllers/inec.controller'

const inec = express.Router()

inec.get('/', getPollingUnits)
inec.get('/centers', getRegCenters)

export default inec
