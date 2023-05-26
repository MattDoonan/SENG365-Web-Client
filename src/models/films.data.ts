import axios from 'axios';
import {getUrl} from "./url.data";


export const postReview = async (userReview:postReview, id:number) => {
    var config = {
        method: 'post',
        url: getUrl() + '/films/' + id + '/reviews',
        headers: {
            'X-Authorization': localStorage.getItem('user_token'),
            'Content-Type': 'application/json'
        },
        data : userReview
    };
    try {
        const response = await axios(config);
        return response.statusText;
    } catch (error:any) {
        return error.response.statusText.substring(error.response.statusText.indexOf('/') + 1).trim();
    }
}

export const editFilm = async (film:postFilm, id:number) => {
    var config = {
        method: 'patch',
        url: getUrl() + '/films/' + id,
        headers: {
            'X-Authorization': localStorage.getItem('user_token'),
            'Content-Type': 'application/json'
        },
        data : film
    };
    try {
        const response = await axios(config);
        return response.statusText;
    } catch (error:any) {
        return error.response.statusText.substring(error.response.statusText.indexOf('/') + 1).trim();
    }
}

export const deleteFilm = async (id:number) => {
    var config = {
        method: 'delete',
        url: getUrl() + '/films/' + id,
        headers: {
            'X-Authorization': localStorage.getItem('user_token')
        }
    };
    try {
        await axios(config);
        return;
    } catch (error:any) {
        return;
    }
}


export const postFilmImage = async (id:number, data:File) => {
    var config = {
        method: 'put',
        url: getUrl() + '/films/'+ id +'/image',
        headers: {
            'X-Authorization': localStorage.getItem('user_token'),
            'Content-Type': data.type
        },
        data : data
    };
    try {
        const response = await axios(config);
        return {status: response.statusText, id:undefined}
    } catch (error:any) {
        return {status: error.response.statusText.substring(error.response.statusText.indexOf('/') + 1).trim(), id: undefined};
    }
}

export const postNewFilm = async (film:postFilm) => {
    var config = {
        method: 'post',
        url: getUrl() + '/films',
        headers: {
            'X-Authorization': localStorage.getItem('user_token'),
            'Content-Type': 'application/json'
        },
        data : film
    };
    try {
        const response = await axios(config);
        return {status: response.statusText, id:response.data.filmId}
    } catch (error:any) {
        return {status: error.response.statusText.substring(error.response.statusText.indexOf('/') + 1).trim(), id: undefined};
    }
}
export const getFilms = async (search:string, age:Array<String>, genre:Array<Number>, sortBy:string, skip:number) => {
    let url = getUrl() + '/films?'
    if (search !== '') {
        url += 'q=' + search + '&';
    }
    for (const a in age) {
        url += 'ageRatings=' + age[a] + '&';
    }
    for (const a in genre) {
        url += 'genreIds=' + genre[a] + '&';
    }
    url += 'sortBy=' + sortBy + '&';
    url += 'count=10&';
    url += 'startIndex=' + skip;
    console.log(url);
    try {
        const response = await axios.get(url);
        return response.data["films"];
    } catch (error) {
        return [];
    }
};

export const getRecommendedFilms = async (director:number, genre:number, id:number) => {
    try {
        const similarGenreData = await axios.get(getUrl() + '/films?genreIds=' + genre);
        const similarDirectorData = await axios.get(getUrl() + '/films?directorId=' + director);
        const similarGenre = similarGenreData.data.films;
        const similarDirector = similarDirectorData.data.films;
        const combinedList: film[] = [];
        for (const film of similarGenre) {
            if (film.filmId !== id && !combinedList.some((f) => f.filmId === film.filmId)) {
                combinedList.push(film);
            }
        }
        for (const film of similarDirector) {
            if (film.filmId !== id && !combinedList.some((f) => f.filmId === film.filmId)) {
                combinedList.push(film);
            }
        }
        return combinedList;
    } catch (error) {
        return [];
    }
}

export const getNumberOfPages = async (search:string, age:Array<String>, genre:Array<Number>) => {
    let url = getUrl() + '/films?';
    if (search !== '') {
        url += 'q=' + search + '&';
    }
    for (const a in age) {
        url += 'ageRatings=' + age[a] + '&';
    }
    for (const a in genre) {
        url += 'genreIds=' + genre[a] + '&';
    }
    console.log(url);
    try {
        const response = await axios.get(url);
        return response.data["films"].length / 10;
    } catch (error) {
        return 0;
    }
}

export const getSelectedFilm = async (id:number) => {
    try {
        const response = await axios.get(getUrl() +'/films/' + id);
        return response.data;
    } catch (error) {
        return null;
    }
}

export const getGenres = async () => {
    try {
        const response = await axios.get(getUrl() + '/films/genres');
        return response.data;
    } catch (error) {
        return [];
    }
}

export const getReviews = async (id:number) => {
    try {
        const response = await axios.get(getUrl() + '/films/' + id + "/reviews");
        return response.data;
    } catch (error) {
        return null;
    }
}