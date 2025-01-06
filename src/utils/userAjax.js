import axios from 'axios';
import BASEURL from '../config/api';
import CONSTANTS from './constants';
/**
 * Common API method
 * @param {string} method GET | POST | DELETE | PATCH
 * @param {string} baseURL http://api.example.com
 * @param {string} url /user/id
 * @param {object} params Query parameters
 * @param {object} headers API headers are appended to common headers
 * @param {object} body API body / Empty by default
 */
export default async (method, url, params = {}, headers = {}, body = {}, baseURL = BASEURL.userUrl) => {
    try {
        const commonHeaders = {
            'x-access-token': localStorage.getItem('X_ACCESS_TOKEN')
         };
        const response = await axios({
            method,
            baseURL,
            url,
            params: { ...params },
            headers: { ...commonHeaders, ...headers },
            data: body
        });
        return {
            status: response.data.statusCode,
            message: response.data.statusMessage,
            totalCount: response.data.totalCount? response.data.totalCount: 0,
            token: response.data.token,
            data: response.data.data
            // full: response
        };
    } catch (error) {
        return {
            data: error,
            err: error,
            message: error.message !== undefined ? error.message : '',
            status: error.status !== undefined ? error.status : 'failed',
        }
    }
};