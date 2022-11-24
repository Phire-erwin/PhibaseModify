// axios
import axios from 'axios'

// Base URL
//const baseURL = 'https://phibasesuite.dev/api/v1'
// const baseURL = process.env.VUE_APP_AXIOS_URL ||'https://phibasesuite.dev/api/v1'
const baseURL = 'http://localhost:3000/api/v1'


export default axios.create({
  baseURL,
})
