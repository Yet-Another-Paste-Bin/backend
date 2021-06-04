/**
 * Middleware whether required parameter are provided or not
 *
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 * @param {Function}  next
 */
function verifyBin(req, res, next) {
  //  Send HTTP status code 400 as a response if body is undefined
  if (req.body === undefined) return res.status(400).end();

  const { binId, data, private, owner_id } = req.body;

  //  Send HTTP status code 400 as a response {binId} and {owner_id} is not provided
  if (req.method === "DELETE" && ![binId, owner_id].includes(undefined))
    return res.status(400).end();

  /**
   * Send HTTP status code 400 as a response {data} and {private} is not provided
   * OR
   * bin is private and {owner_id} is not provided
   */
  if (
    [data, private].includes(undefined) ||
    (private && [owner_id].includes(undefined))
  )
    return res.status(400).end();

  return next();
}

module.exports = { verifyBin };
