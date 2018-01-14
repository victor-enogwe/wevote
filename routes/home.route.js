import { Router } from 'express';

/* GET api home. */
export default Router().get('/', (req, res) => res.status(200)
  .json({ status: 'success', message: 'Welcome to the WeVote api.' }));
