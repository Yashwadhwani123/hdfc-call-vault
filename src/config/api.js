// PROD URL

import CONSTANTS from '../utils/constants';

const currentEnvironment = {
  local: {
    userUrl: 'https://callv.hdfclife.com',
    roleUrl: 'https://callv.hdfclife.com',
    callRecordUrl: 'https://callv.hdfclife.com',
    callCenterUrl: 'https://callv.hdfclife.com',
  },
  development: {
    userUrl: 'https://callv.hdfclife.com',
    roleUrl: 'https://callv.hdfclife.com',
    callRecordUrl: 'https://callv.hdfclife.com',
    callCenterUrl: 'https://callv.hdfclife.com',
  },
  staging: {
    url: '',
  },
  production: {
    url: '',
  },
};

export default process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.LOCAL
  ? currentEnvironment.local
  : process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.DEVELOPMENT
  ? currentEnvironment.development
  : process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.STAGING
  ? currentEnvironment.staging
  : process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.PRODUCTION
  ? currentEnvironment.production
  : currentEnvironment.development;

// UAT URL

// import CONSTANTS from '../utils/constants';

// const currentEnvironment = {
//   local: {
//     userUrl: 'https://vcall-u.hdfclife.com',
//     roleUrl: 'https://vcall-u.hdfclife.com',
//     callRecordUrl: 'https://vcall-u.hdfclife.com',
//     callCenterUrl: 'https://vcall-u.hdfclife.com',
//   },
//   development: {
//     userUrl: 'https://vcall-u.hdfclife.com',
//     roleUrl: 'https://vcall-u.hdfclife.com',
//     callRecordUrl: 'https://vcall-u.hdfclife.com',
//     callCenterUrl: 'https://vcall-u.hdfclife.com',
//   },
//   staging: {
//     url: '',
//   },
//   production: {
//     url: '',
//   },
// };

// export default process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.LOCAL
//   ? currentEnvironment.local
//   : process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.DEVELOPMENT
//   ? currentEnvironment.development
//   : process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.STAGING
//   ? currentEnvironment.staging
//   : process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.PRODUCTION
//   ? currentEnvironment.production
//   : currentEnvironment.development;

//  local URL

//  import CONSTANTS from '../utils/constants';

// const currentEnvironment = {
//   local: {
//     userUrl: 'http://52.66.246.30:8083',
//     roleUrl: 'http://52.66.246.30:8082',
//     callRecordUrl: 'http://52.66.246.30:8084',
//     callCenterUrl: 'http://52.66.246.30:8081',
//   },
//   development: {
//     userUrl: 'http://52.66.246.30:8083',
//     roleUrl: 'http://52.66.246.30:8082',
//     callRecordUrl: 'http://52.66.246.30:8084',
//     callCenterUrl: 'http://52.66.246.30:8081',
//   },
//   staging: {
//     url: '',
//   },
//   production: {
//     url: '',
//   },
// };

// export default process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.LOCAL
//   ? currentEnvironment.local
//   : process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.DEVELOPMENT
//   ? currentEnvironment.development
//   : process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.STAGING
//   ? currentEnvironment.staging
//   : process.env.REACT_APP_API_URL === CONSTANTS.ENVIRONMENT_VAR.PRODUCTION
//   ? currentEnvironment.production
//   : currentEnvironment.development;
