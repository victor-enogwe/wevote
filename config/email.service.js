import sendgrid from '@sendgrid/mail';

const { SENDGRID_API_KEY } = process.env;

sendgrid.setApiKey(SENDGRID_API_KEY);
/**
 * SendGrid Mailer
 *
 * @export
 * @param {string} to the receiving email address
 * @param {string} from the sender email address
 * @param {string} subject email subject
 * @param {string} text the text message
 * @param {string} message the html message
 * @param {string} templateId the html template id on sendgrid
 * @param {obbject} substitutions the template replacement object,
 *
 * @returns {object} send confirmation
 */
export function sendMailSendGrid(to, from, subject, text, message, templateId, substitutions) {
  return sendgrid.send({
    to, from, subject, message, text, templateId, substitutions
  });
}

export default sendMailSendGrid;
