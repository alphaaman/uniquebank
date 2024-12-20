import axios from "axios";

let baseUrl = "http://localhost:8999";

export const register = async(values, config)=>{
  const response = await axios.post(`${baseUrl}/admin/register`, values, config);
  return response
    
}
export const authenticate = async(values)=>{
    return await axios.post(`${baseUrl}/admin/authenticate`, values);
}


// export const getUsers =()=>{ 
//     return axios.get(url);
    
// }