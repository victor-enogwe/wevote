import axios from 'axios'

export async function getPollingUnits (req, res) {
  try {
    const { state, lgaId } = req.query
    const url = `http://www.inecnigeria.org/wp-content/themes/inec/ndmPHP.php?\
data=%7B"state"%3A"${state}"%2C"lga"%3A"${lgaId}"%7D`
    const { data } = await axios.get(url)

    return res.status(200).json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: 'error', error })
  }
}
