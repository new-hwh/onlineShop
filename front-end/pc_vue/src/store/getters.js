const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  role_type: state => state.user.role_type,
  name: state => state.user.name
}
export default getters
