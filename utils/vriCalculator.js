/**
 * Calculate User Vri Score
 *
 * @export
 * @param {object} userVris the error object
 * @returns {number} the user Vri score
 */
export default function vriCalculator(userVris) {
  // console.log(userVris)
  let score = 0;
  for (const x in userVris) {
    score += +userVris[x].dataValues.weight;
  }
  return score;
}
