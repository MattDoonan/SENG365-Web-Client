type film = {
    filmId: number,
    title: string,
    genreId: number,
    releaseDate: string,
    directorId: number,
    directorFirstName: string,
    directorLastName: string,
    rating: number,
    ageRating: string
}

type filmFull = {
    description: string,
    numReviews: number,
    runtime: number
} & film

type genre = {
    genreId: number,
    name: string
}

type review  = {
    reviewerId: number,
    rating: number,
    review: string,
    reviewerFirstName: string,
    reviewerLastName: string,
    timestamp : string
}

type postReview = {
    rating: number,
    review?: string,
}

type postFilm = {
    title: string,
    description: string,
    releaseDate?: string,
    genreId: number,
    runtime?: number,
    ageRating?:string
}

type postFilmResponse = {
    status: string,
    id?: number
}
