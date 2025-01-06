import { toast } from 'react-toastify';
import CONSTANTS from './constants';

toast.configure();
export default function handle_error(errorCode, message) {
    if (errorCode === CONSTANTS.STATUS.INTERNAL_SERVER_ERROR) {
        toast.error('Internal Server Error...!!!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored' 
        });
    } else if (errorCode === CONSTANTS.STATUS.DUPLICATE_RECORD) {
        toast.info('Data already exists..!!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored' 
        });
    } else if (errorCode === CONSTANTS.STATUS.FORBIDDEN) {
        // window.location.pathname = CONSTANTS.PATHS.LOGIN;
        localStorage.clear();
        toast.error('Unauthorized Access..!!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        });
    } else if (errorCode === 'failed') {
        // window.location.pathname = CONSTANTS.PATHS.LOGIN;
        localStorage.clear();
        toast.error(message, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        });
    } else if (errorCode === CONSTANTS.STATUS.NOT_APPLICABLE) {
        toast.error('This record cannot be deleted..!!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored' 
        });
    } else if (errorCode === CONSTANTS.STATUS.BAD_REQUEST) {
        toast.error('Bad Request..!!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored' 
        });
    } else if (errorCode === CONSTANTS.STATUS.UNSUPPORTED_MEDIA_TYPE) {
        toast.error(message, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored' 
        });
    } else {
        toast.error('Some error Occured', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored' 
        });
    }
}
