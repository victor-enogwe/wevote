import database from '../../models';

const { Vri } = database;
const allowedFields = ['code', 'choice', 'weight'];

/**
 * Creates A VRI
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response object
 *
 * @returns {object} the json response
 */
export async function createVri(req, res) {
  try {
    const { body } = req;

    await Vri.create(body, { fields: allowedFields });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * update A VRI
 *
 * @export
 * @param {object} req the request
 * @param {object} res the response
 *
 * @returns {object} the json update response
 */
export async function updateVri(req, res) {
  try {
    const { body, params: { id } } = req;
    Vri.update(body, {
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }, { fields: allowedFields });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
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
export async function getVris(req, res) {
  try {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const data = await Vri.findAndCount({
      limit,
      offset,
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (data.rows.length > 0) {
      const pages = +(data.count / limit).toFixed();
      data.totalPages = pages === 0 ? 1 : pages;
      data.currentPage = (offset === 0 ? 1 : offset / limit).toFixed();
      return res.status(200).json({ status: 'success', data });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

export function updateVris(req, res) {}

export function deleteVris(req, res) {}

export function deleteVri (req, res) {}
