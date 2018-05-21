import express from 'express'
import { getPollingUnits } from '../controllers/inec.controller'

const inec = express.Router()

inec.get('/', getPollingUnits)

export default inec
