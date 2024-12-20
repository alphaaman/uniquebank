
const storeToken = (value) => {
  localStorage.setItem('token', value)
}

const getToken = () => {
  let token = localStorage.getItem('token')
  return token
}
const getUsernameFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenPayload = token.split('.')[1];
    const base64 = tokenPayload.replace('-', '+').replace('_', '/');
    const decodedPayload = JSON.parse(window.atob(base64));
    console.log(decodedPayload,"username")
    return decodedPayload.sub;
    
  }
  return null;
};

const getRolesFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenPayload = token.split('.')[1];
    const base64 = tokenPayload.replace('-', '+').replace('_', '/');
    const decodedPayload = JSON.parse(window.atob(base64));
    
    return decodedPayload.roles;
  }
  return null;
};

const removeToken = (values) => {
  localStorage.removeItem(values)
}

export { storeToken, getToken, getUsernameFromToken,getRolesFromToken,removeToken }
