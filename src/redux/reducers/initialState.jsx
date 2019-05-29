export default {
  delta: {
    sessionStatus: !!sessionStorage.jwt,
    username: sessionStorage.username,
    flowData: []
  }
};
