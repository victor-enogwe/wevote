import axios from 'axios';
/**
 * fetch all VRIs
 *
 * @export
 * @param {object} req the request
 * @param {object} res the response
 *
 * @returns {object} the json update response
 */
export function getNews(req, res) {
  axios.get('http://inecnews.com/wp-json/wp/v2/posts')
    .then((result) => {
      if (result.data) {
        res.status(201).json({ status: 'success', data: result.data });
      } else {
        res.status(400).json({ status: 'fail', message: 'No news found' });
      }
    });
}

/**
 * fetch all VRIs
 *
 * @export
 * @param {object} req the request
 * @param {object} res the response
 *
 * @returns {object} the json update response
 */
export function getImages(req, res) {
  const mediaID = req.query.media_id;
  axios.get(`http://inecnews.com/wp-json/wp/v2/media/${mediaID}`)
    .then((result) => {
      if (result.data) {
        res.status(201).json({ status: 'success', data: result.data });
      } else {
        res.status(400).json({ status: 'fail', message: 'No image found' });
      }
    });
}

