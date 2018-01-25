import database from '../../models';

const { Vri } = database;
const allowedFields = ['question', 'weight'];

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

export function getVris(req, res) {}

export function updateVris(req, res) {}

export function deleteVris(req, res) {}

export function deleteVri (req, res) {}
