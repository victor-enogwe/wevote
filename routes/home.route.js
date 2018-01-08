import { Router } from 'express';

/* GET api home. */
export default Router().get('/', (req, res) => res.status(200)
  .json({ message: 'Welcome to the WeVote api.' }));
