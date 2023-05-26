import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import {getUrl} from "../models/url.data";
import MovieIcon from "@mui/icons-material/Movie";
import CardActions from "@mui/material/CardActions";
import StarRateIcon from "@mui/icons-material/StarRate";
import Chip from "@mui/material/Chip";
import {Avatar} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import * as React from "react";
import {getGenres} from "../models/films.data";
import '../css/global.css';
import '../css/film.css';

type props = {
    films:Array<film>,
    error:string
}
const DisplayListOfFilms = ({films, error}:props) => {

    const [genres, setGenres] = React.useState <Array<genre>>([])

    React.useEffect(() => {
        async function getAllGenres () {
            setGenres(await getGenres());
        }
        getAllGenres()
    }, []);


    if (films.length === 0 || films.length === undefined) {
        return (<Typography variant="body2" className="description" align="center">
            {error}
        </Typography>);
    }
    return <>{films.map((f: film) =>
        <a href={`/film/` + f.filmId} className="link" key={f.filmId}>
            <Card className="related">
                <CardMedia
                    component="img"
                    height="220"
                    image={getUrl() + '/films/' + f.filmId + '/image' ?? MovieIcon}
                    alt="film-image"
                />
                <CardActions className="related-film-info">
                    <Typography variant="body2" className="description related-title">
                        <label className="facts">
                            <StarRateIcon/>
                            {(f.rating === 0 ? "No ratings" : f.rating + "/10")}
                        </label>
                        <label className="timestamp">
                            {(f.releaseDate.substring(0, f.releaseDate.indexOf('T')) ?? "No time")}
                            {" " + (f.releaseDate.substring(f.releaseDate.indexOf('T') + 1, f.releaseDate.indexOf('.')) ?? '')}
                        </label>
                    </Typography>
                    <Typography variant="body1" className="description" align="center">
                        {f.title}
                    </Typography>
                </CardActions>
                <CardActions className="key-info">
                    <Chip className="small-basic-info"
                          avatar={<Avatar src={getUrl() + '/users/' + f.directorId + '/image' ?? PersonIcon}/>}
                          label={f.directorFirstName + " " + f.directorLastName}/>
                </CardActions>
                <CardActions className="key-info">
                    <Chip className="small-basic-info" label={genres.find((g) => g.genreId === f.genreId)?.name}/>
                    <Chip className="small-basic-info" label={(f.ageRating ?? 'TBC')}/>
                </CardActions>
            </Card>
        </a>
    ) }</>;
}

export default DisplayListOfFilms;