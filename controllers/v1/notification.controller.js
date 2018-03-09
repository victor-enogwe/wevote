import database from '../../models';

const { Notification, User } = database;
const allowedFields = ['code', 'group', 'message'];

/**
 * Creates A Notification
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response object
 *
 * @returns {object} the json response
 */
export async function createNotification(req, res) {
  try {
    const { body } = req;
    await Notification.create(body, { fields: allowedFields });
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * update A Notification
 *
 * @export
 * @param {object} req the request
 * @param {object} res the response
 *
 * @returns {object} the json update response
 */
export async function updateNotification(req, res) {
  try {
    const { body, params: { id } } = req;
    await Notification.update(body, {
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }, { fields: allowedFields });
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * fetch all Notifications
 *
 * @export
 * @param {object} req the request
 * @param {object} res the response
 *
 * @returns {object} the json update response
 */
export async function getNotifications(req, res) {
  try {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const data = await Notification.findAndCount({
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

/**
 * Creates A Notification
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response object
 *
 * @returns {object} the json response
 */
export async function sendNotification(req, res) {
  try {
    const { count } = await Notification.findAndCount({
      where: { group: 'general' }
    });
    const { body } = req;
    const code = count + 1;
    body.code = `GEN${code}`;
    body.group = 'general';
    const notification = await Notification.create(body, { fields: allowedFields });
    const users = await User.findAll();
    users.forEach((user) => {
      user.getNotifications()
        .then((notifications) => {
          if (notifications) {
            notifications.push(notification);
            user.setNotifications(notifications);
          } else {
            user.setNotifications(notification);
          }
        });
    });
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

export function updateNotifications(req, res) {}

export function deleteNotifications(req, res) {}

export function deleteNotification (req, res) {}
