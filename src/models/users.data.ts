import axios from "axios";
import {getUrl} from "./url.data";

export const removeUserPhoto = async () => {
    var config = {
        method: 'delete',
        url: getUrl() + '/users/' + localStorage.getItem('user_id') + '/image',
        headers: {
            'X-Authorization': localStorage.getItem('user_token'),
        }
    };
    try {
        await axios(config);
        return;
    } catch (error) {
        return;
    }
}


export const updateUserInfo = async (user:updateUserNoPassword | updateUserPassword) => {
    var config = {
        method: 'patch',
        url: getUrl()+'/users/'+localStorage.getItem('user_id'),
        headers: {
            'X-Authorization': localStorage.getItem('user_token'),
            'Content-Type': 'application/json'
        },
        data : user
    };
    try {
        const response = await axios(config);
        return response.statusText;
    } catch (error:any) {
        return error.response.statusText.substring(error.response.statusText.indexOf('/') + 1).trim();
    }
}


export const getUserReviewedFilms = async () => {
    try {
        const response = await axios.get(getUrl() + '/films?reviewerId=' + localStorage.getItem('user_id'));
        return response.data["films"];
    } catch (error) {
        return [];
    }
}

export const getUserDirectedFilms = async () => {
    try {
        const response = await axios.get(getUrl() + '/films?directorId=' + localStorage.getItem('user_id'));
        return response.data["films"];
    } catch (error) {
        return [];
    }
}

export const getActiveUser = () => {
    const id = localStorage.getItem('user_id');
    const token = localStorage.getItem('user_token');
    if (id !== null && id !== '' && token !== null && token !== '') {
        const loggedInUser:userLoggedIn = {userId:parseInt(id), token:token}
        return loggedInUser;
    }
    return null;
}

export const getActiveUserInformation = async () => {
    var config = {
        method: 'get',
        url: getUrl() + '/users/' + localStorage.getItem('user_id'),
        headers: {
            'X-Authorization': localStorage.getItem('user_token')
        }
    };
    try {
        const user = await axios(config);
        if (user.status === 401) {
            localStorage.setItem('user_id', '');
            localStorage.setItem('user_token', '');
        }
        return user.data;
    } catch (error) {
        localStorage.setItem('user_id', '');
        localStorage.setItem('user_token', '');
        return null;
    }
}

export const setCurrentPhoto = async (userImage:File) => {
    var config = {
        method: 'put',
        url: getUrl() + '/users/' + localStorage.getItem('user_id') + '/image',
        headers: {
            'Content-Type': userImage.type,
            'X-Authorization': localStorage.getItem('user_token')
        },
        data: userImage
    };
    try {
        await axios(config);
        return true
    } catch (error) {
        return false;
    }
}

export const logoutActiveUser = async () => {
    var config = {
        method: 'post',
        url: getUrl() + '/users/logout',
        headers: {
            'X-Authorization': localStorage.getItem('user_token')
        },
        data: ''
    };
    try {
        localStorage.setItem('user_id', '');
        localStorage.setItem('user_token', '');
        await axios(config);
        return false;
    } catch (error) {
        return false;
    }
}

export const loginUser = async (user:userLogin) => {
    var config = {
        method: 'post',
        url: getUrl()+'/users/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data : user
    };
    try {
        const response = await axios(config);
        const loggedInUser:userLoggedIn = response.data;
        if (loggedInUser != null) {
            localStorage.setItem('user_token', loggedInUser.token);
            localStorage.setItem('user_id', loggedInUser.userId.toString());
        }
        return true;
    } catch (error) {
        return false;
    }
}

export const registerUser = async (user:userRegister) => {
    var config = {
        method: 'post',
        url: getUrl() + '/users/register',
        headers: {
            'Content-Type': 'application/json'
        },
        data : user
    };
    try {
        const response = await axios(config);
        return response.statusText;
    } catch (error:any) {
        return error.response.statusText.substring(error.response.statusText.indexOf('/') + 1).trim();
    }
}
