import * as React from 'react';
import {
    deleteFilm,
    getGenres,
    getRecommendedFilms,
    getReviews,
    getSelectedFilm, postFilmImage,
    editFilm, postReview
} from "../models/films.data";
import {useParams} from "react-router-dom";
import '../css/global.css';
import '../css/film.css';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import StarRateIcon from '@mui/icons-material/StarRate';
import PersonIcon from '@mui/icons-material/Person';
import Chip from "@mui/material/Chip";
import {getUrl} from "../models/url.data";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton, Input, InputLabel,
    List,
    Menu,
    MenuItem,
    Rating, Select, SelectChangeEvent,
    TextField
} from "@mui/material";
import {useNavBar} from "./nav";
import DisplayListOfFilms from "./displayListOfFilms";
import SettingsIcon from '@mui/icons-material/Settings';
import {ChangeEvent, useState} from "react";
import StarIcon from '@mui/icons-material/Star';

const Film = () => {
    const { id } = useParams();
    const [selectedFilm, setFilm] = React.useState<filmFull>();
    const [genres, setGenres] = React.useState < Array < genre >> ([]);
    const [reviews, setReviews] = React.useState < Array < review >> ([]);
    const [relatedFilms, setRelatedFilms] = React.useState < Array < film >> ([]);
    const [isOwner, setIsOwner] = React.useState(false);
    const [deleteFilmActive, setDeleteFilmActive] = useState(false);
    const [editFilmActive, setEditFilmActive] = useState(false);
    const [newFilmAge, setNewFilmAge] = React.useState < string > ();
    const [newFilmGenre, setGenre] = React.useState < number > ();
    const [newFilmRuntime, setNewFilmRuntime] = React.useState < number > ();
    const [newFilmTitle, setNewFilmTitle] = React.useState < string > ();
    const [newFilmDescription, setNewFilmDescription] = React.useState < string > ();
    const [newFilmDate, setNewFilmDate] = React.useState < string > ();
    const [message, setError] = useState('');
    const [currentImage, setCurrentImage] = useState<string>();
    const [selectedFilmImage, setSelectedFilmImage] = useState<File | null>(null);
    const [canReview, setCanReview] = React.useState(false);
    const [reviewFilmActive, setReviewFilmActive] = useState(false);
    const [filmRating, setFilmRating] = React.useState < number > (5);
    const [filmReview, setFilmReview] = React.useState < string > ();
    const [reviewError, setReviewError] = useState('');




    React.useEffect(() => {
        async function getAllGenres () {
            setGenres(await getGenres());
        }
        getAllGenres()
    }, []);

    React.useEffect(() => {
        async function getFilm() {
            let filmData;
            let reviewData:Array<review> = [];
            let similar: React.SetStateAction<film[]> = [];
            if (id === null) {
                return;
            } else if (typeof id === "string") {
                const parsedId = parseInt(id, 10);
                filmData = await getSelectedFilm(parsedId);
                reviewData = await getReviews(parsedId);

            }
            if (!filmData) {
                return;
            }
            setFilm(filmData);
            setReviews(reviewData);
            if (filmData != null) {
                similar = await getRecommendedFilms(filmData.directorId ,filmData.genreId, filmData.filmId);
            }
            setCurrentImage(getUrl() + '/films/' + filmData.filmId + '/image');
            setRelatedFilms(similar);
            const userId = localStorage.getItem('user_id');
            if (filmData.directorId === (userId ? parseInt(userId) : undefined)) {
                setCanReview(false);
                setIsOwner(true);
                setNewFilmAge(filmData.ageRating);
                setGenre(filmData.genreId);
                setNewFilmRuntime(filmData.runtime);
                setNewFilmTitle(filmData.title);
                setNewFilmDescription(filmData.description);
                setNewFilmDate(formatDateForInput(filmData.releaseDate));
            } else {
                setIsOwner(false);
                if (userId == null) {
                    setCanReview(true);
                }else if (!reviewData.some(review => review.reviewerId === parseInt(userId))) {
                    setCanReview(true);
                }
            }
        }
        getFilm();
    }, [id, editFilmActive, reviewFilmActive]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleShowEditFilm = () => {
        setEditFilmActive(true);
        setAnchorEl(null);
    };

    const handleDeleteFilm = () => {
        setAnchorEl(null);
        setDeleteFilmActive(true);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const displayFilm = () => {
        if (selectedFilm === null || selectedFilm === undefined) {
            return <div className="film-result">No film with id {id}</div>;
        }
        return (
            <Card className="film-information" sx={{ margin: 'auto', marginTop: '50px', position: 'relative'}} elevation={0}>
                <label hidden={!isOwner}>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{backgroundColor:'#800000'}}
                        style={{ position: 'absolute', top: 0, right: 0, fontSize: 10, padding:5 }}
                    >
                        <SettingsIcon style={{color:"white"}}/>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={event => {setAnchorEl(null);}}
                        PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                        <MenuItem key={0} onClick={handleShowEditFilm}>
                            {"Edit film"}
                        </MenuItem>
                        <MenuItem key={0} onClick={handleDeleteFilm}>
                            {"Delete film"}
                        </MenuItem>
                    </Menu>
                </label>
                <Typography variant="h2" className="description">
                    {selectedFilm.title}
                </Typography>
                <Typography variant="h6" className="description">
                    {(selectedFilm.releaseDate.substring(0, selectedFilm.releaseDate.indexOf('T')) ?? 'TBC')}
                    {" " + (selectedFilm.releaseDate.substring(selectedFilm.releaseDate.indexOf('T') + 1, selectedFilm.releaseDate.indexOf('.')) ?? '')}
                    {" " + ((selectedFilm.runtime) ?? 'TBC ') + "m"}
                </Typography>
                <CardMedia
                    component="img"
                    height="700"
                    image={currentImage}
                    alt="film-image"
                />
                <CardContent className="content-overlay">
                    <CardActions className="key-info">
                        <Chip className="director-info-film" avatar={<Avatar src={getUrl() + '/users/' + selectedFilm.directorId + '/image' ?? PersonIcon}/>} label={selectedFilm.directorFirstName + " " + selectedFilm.directorLastName}/>
                        <Chip className="basic-info" label={"Genre: " + genres.find((g) => g.genreId === selectedFilm.genreId)?.name} />
                        <Chip className="basic-info" label={"Age rating: " + (selectedFilm.ageRating ?? 'TBC')} />
                    </CardActions>
                    <CardContent>
                        <Typography variant="body2" className="description">
                            {selectedFilm.description ?? "No description"}
                        </Typography>
                    </CardContent>
                </CardContent>
            </Card>
        );
    };

    const displayAllReviews = () => {
        if (reviews.length === 0) {
            return (<Typography variant="body2" className="description" align="center">
                {"No reviews"}
            </Typography>);
        }
        return reviews.map((r:review) =>
            <div key={r.reviewerId}>
                <Card className="review">
                    <CardActions className="review-title">
                        <Chip className="director-info-film" avatar={<Avatar src={getUrl() + '/users/' + r.reviewerId + '/image' ?? PersonIcon}/>} label={r.reviewerFirstName + " " + r.reviewerLastName}/>
                        <Typography variant="body2" className="timestamp">
                            {(r.timestamp.substring(0, r.timestamp.indexOf('T')) ?? "No time")}
                        </Typography>
                    </CardActions>
                    <CardActions>
                        <Rating name="read-only" value={r.rating} readOnly max={10} className="rating" emptyIcon={<StarRateIcon className="empty-rating"/>}/>
                    </CardActions>
                    <CardContent>
                        <Typography variant="body2" className="description">
                            {r.review ?? "No comment"}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }
    const displayReviews = () => {
        if (selectedFilm === null || selectedFilm === undefined) {
            return <div/>;
        }
        return (
            <Card className="review-information" sx={{ margin: 'auto', marginTop: '50px', position: 'relative' }}>
                <CardContent>
                    <label hidden={!canReview}>
                        <Button
                            variant="contained"
                            disableElevation
                            style={{ position: 'absolute', top: 5, right: 5, fontSize: 10, padding:5, minWidth:100, backgroundColor:'#800000'}}
                            onClick={() => {
                                setReviewFilmActive(true)
                            }}
                        >
                            Add review
                        </Button>
                    </label>
                    <Typography variant="h6" className="description facts">
                        {"Reviews"}
                    </Typography>
                    <CardActions >
                        <Typography variant="body2" className="description facts">
                            <StarRateIcon />
                            {(selectedFilm.rating === 0 ? "No ratings" : selectedFilm.rating + "/10")}
                        </Typography>
                        <Typography variant="body2" className="description facts">
                            <PersonIcon />
                            {selectedFilm.numReviews}
                        </Typography>
                    </CardActions>
                    <List className="the-reviews">
                        {displayAllReviews()}
                    </List>
                </CardContent>
            </Card>
        );
    }

    const similarFilms = () => {
        if (selectedFilm === null || selectedFilm === undefined) {
            return <div/>;
        }
        return (
            <Card className="review-information" sx={{ margin: 'auto', marginTop: '50px', position: 'relative' }}>
                <CardContent>
                    <Typography variant="h6" className="description facts">
                        {"Similar films"}
                    </Typography>
                    <List className="the-reviews">
                        <DisplayListOfFilms films = {relatedFilms} error={"No related films"}/>
                    </List>
                </CardContent>
            </Card>
        );
    }

    const confirmDeleteFilm = async () => {
        if (selectedFilm?.filmId != null) {
            await deleteFilm(selectedFilm.filmId);
            window.location.assign("/");
        }
    }

    const cancelDeleteFilm = async () => {
        setDeleteFilmActive(false);
    }

    const deleteFilmPrompt = () => {
        if (!isOwner) {
            setDeleteFilmActive(false);
            return;
        }
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" sx={{color:'white'}}>
                    Are you sure you want to delete this film
                </Typography>
                <Grid container spacing={2} maxWidth={700}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            onClick={event => {confirmDeleteFilm()}}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor:'#800000'}}
                        >
                            Confirm
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={event => {cancelDeleteFilm()}}
                            sx={{ mt: 3, mb: 2, backgroundColor:'#800000'}}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const handleImageUploadFilm = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setSelectedFilmImage(file);
    };

    function formatDateForInput(dateString: string) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const handleEditFilm = async (event: { preventDefault: () => void; }) => {
        if (selectedFilm == null) {
            return;
        }
        event.preventDefault();
        if (newFilmTitle == null || newFilmDescription == null || newFilmGenre == null) {
            setError('An image, title, description and genre is required to create a film');
            return;
        }
        const newFilm: postFilm = {
            title: newFilmTitle,
            description: newFilmDescription,
            genreId: newFilmGenre,
            ageRating: newFilmAge ?? undefined,
            runtime: newFilmRuntime ? (isNaN(newFilmRuntime) ? undefined : newFilmRuntime) : undefined,
            releaseDate: newFilmDate ? String(newFilmDate.replace("T", " ") + ":00") : undefined
        }
        let response:string = await editFilm(newFilm, selectedFilm.filmId);
        if (response === "Cannot release a film in the past.") {
            const noRelease: postFilm = {
                title: newFilmTitle,
                description: newFilmDescription,
                genreId: newFilmGenre,
                ageRating: newFilmAge ?? undefined,
                runtime: newFilmRuntime ? (isNaN(newFilmRuntime) ? undefined : newFilmRuntime) : undefined,
                releaseDate: undefined
            }
            response = await editFilm(noRelease, selectedFilm.filmId);
        }
        if (response === "OK") {
            let filmImageResponse:postFilmResponse = {status:'OK', id:undefined}
            if (selectedFilmImage != null) {
                filmImageResponse = await postFilmImage(selectedFilm.filmId, selectedFilmImage);
                setCurrentImage(URL.createObjectURL(selectedFilmImage));
            }
            if (filmImageResponse.status === "OK") {
                console.log("valid film")
                setEditFilmActive(false);
                setError('');
            } else {
                console.log("Invalid image")
                setError(filmImageResponse.status);
            }
        } else {
            console.log("Invalid film")
            setError(response);
        }
    }

    const editFilmPrompt = () => {
        if (!isOwner) {
            setDeleteFilmActive(false);
            return;
        }
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <label style={{ position: 'relative', display: 'inline-block', marginBottom:10, minWidth:100}}>
                    <input
                        accept="image/*"
                        type="file"
                        style={{ display: 'none' }}
                        id="image-upload-input"
                        onChange={handleImageUploadFilm}
                    />
                    <CardMedia
                        component="img"
                        sx={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            backgroundColor: 'white',
                            border: 'none'
                        }}
                        image={selectedFilmImage ? URL.createObjectURL(selectedFilmImage) : currentImage}
                    />
                    <label htmlFor="image-upload-input">
                        <Button
                            variant="contained"
                            disableElevation
                            style={{ position: 'absolute', bottom: 0, right: 22, fontSize: 10, padding:5, minWidth:100, backgroundColor:'#800000'}}
                            onClick={() => {
                                document.getElementById('image-upload-input')?.click();
                            }}
                        >
                            Upload image
                        </Button>
                    </label>
                </label>
                <Typography component="h1" variant="h5" sx={{color:'white'}}>
                    Edit film
                </Typography>
                <Typography variant="body1" sx={{color:'red'}}>
                    {message}
                </Typography>
                <Box component="form" onSubmit={handleEditFilm} sx={{ mt: 3 }}>
                    <Grid container spacing={2} maxWidth={700}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Title"
                                autoFocus
                                type="text"
                                defaultValue={newFilmTitle}
                                InputLabelProps={{
                                    style: { color: "white"},
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white !important',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                                inputProps={{ style: { color: "white"} }}
                                onChange={event => {
                                    setNewFilmTitle(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Description"
                                type="text"
                                multiline
                                defaultValue={newFilmDescription}
                                rows={3}
                                InputLabelProps={{
                                    style: { color: "white"},
                                }}
                                sx={{
                                    height:100,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white !important',
                                            height:100,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                                inputProps={{ style: { color: "white"} }}
                                onChange={event => {
                                    setNewFilmDescription(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                defaultValue={newFilmDate ?? null}
                                type="datetime-local"
                                InputLabelProps={{
                                    style: { color: "white"},
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white !important',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                                inputProps={{ style: { color: "white"} }}
                                onChange={event => {
                                    setNewFilmDate(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Runtime (minutes)"
                                inputMode="numeric"
                                InputLabelProps={{
                                    style: { color: "white" },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white !important',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                                inputProps={{
                                    style: { color: "white" },
                                }}
                                onChange={event => {
                                    const inputValue = event.target.value;
                                    if (inputValue === '') {
                                        setNewFilmRuntime(undefined);
                                        return;
                                    }
                                    let numericValue = parseInt(inputValue, 10);
                                    if (isNaN(numericValue)) {
                                        return;
                                    }
                                    setNewFilmRuntime(numericValue);
                                }}
                                value={newFilmRuntime?.toString() ?? ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{minWidth:'100%'}}>
                                <Autocomplete
                                    options={genres}
                                    getOptionLabel={(option) => option.name}
                                    disableCloseOnSelect
                                    defaultValue={genres.find(genre => genre.genreId === newFilmGenre)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Genre"
                                            variant="standard"
                                            color= "error"
                                            InputLabelProps={{
                                                style: { color: "#ffffff" },
                                            }}
                                            placeholder="Search genre"
                                            sx={{
                                                color: "white",
                                                "& .MuiAutocomplete-inputRoot": {
                                                    color: "white",
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel color= "error" sx = {{color:"#ffffff"}}>Select age rating</InputLabel>
                                <Select
                                    value={newFilmAge}
                                    color= "error"
                                    sx = {{color:"#ffffff"}}
                                    onChange={(event:SelectChangeEvent<String>) => {
                                        setNewFilmAge(event.target.value.toString());
                                    }}
                                    input={<Input id="select-multiple-chip" />}
                                >
                                    {<MenuItem key={"G"} value={"G"}>G</MenuItem>}
                                    {<MenuItem key={"PG"} value={"PG"}>PG</MenuItem>}
                                    {<MenuItem key={"M"} value={"M"}>M</MenuItem>}
                                    {<MenuItem key={"R13"} value={"R13"}>R13</MenuItem>}
                                    {<MenuItem key={"R16"} value={"R16"}>R16</MenuItem>}
                                    {<MenuItem key={"R18"} value={"R18"}>R18</MenuItem>}
                                    {<MenuItem key={"TBC"} value={"TBC"}>TBC</MenuItem>}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                onClick={event => {setEditFilmActive(false); setError('')}}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor:'#800000'}}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor:'#800000'}}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }

    const labels: { [index: string]: string } = {
        1: 'Worse than Morbius',
        2: 'Razzies nominee',
        3: 'Its so bad its good',
        4: 'Rotten',
        5: 'Your average Marvel movie',
        6: 'Mid',
        7: 'Might get an Oscar',
        8: 'A Steven Spielberg movie',
        9: 'GodFather level',
        10: 'Almost better than the Dark Knight',
    };

    const handlePostReview = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const review:postReview = {rating:filmRating, review:filmReview??undefined}
        if (selectedFilm != null) {
            const response:string = await postReview(review, selectedFilm?.filmId)
            if (response !== 'Created') {
                setReviewError(response);
            } else {
                setReviewFilmActive(false);
                setReviewError('');
                setCanReview(false);
            }
        }
    }

    const addReviewPrompt = () => {
        if (!canReview) {
            setReviewFilmActive(false);
            setReviewError('');
            return;
        } else if (localStorage.getItem('user_id') == null || localStorage.getItem('user_id') === '') {
            window.location.assign("/login")
        }
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" sx={{color:'white'}}>
                    Review film
                </Typography>
                <Typography variant="body1" sx={{color:'red'}}>
                    {reviewError}
                </Typography>
                <Box component="form" onSubmit={handlePostReview} sx={{ mt: 3 }}>
                    <Grid container spacing={2} maxWidth={700}>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    maxWidth: 700,
                                    display: 'flex',
                                    flexDirection:'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Rating
                                    name="text-feedback"
                                    value={filmRating}
                                    max={10}
                                    onChange={(event ,value) => {setFilmRating(value ?? 1)}}
                                    precision={1}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                <Box sx={{ ml: 2, color:'white' }}>{labels[filmRating]}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Comment"
                                type="text"
                                multiline
                                rows={3}
                                InputLabelProps={{
                                    style: { color: "white"},
                                }}
                                sx={{
                                    height:100,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white !important',
                                            height:100,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                                inputProps={{ style: { color: "white"} }}
                                onChange={event => {
                                    setFilmReview(event.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                onClick={event => {setReviewFilmActive(false); setReviewError('');}}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor:'#800000'}}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor:'#800000'}}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }



        return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
        }}>
            <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                height: '100%',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getUrl()}/films/${selectedFilm?.filmId}/image)`,
                filter: 'blur(30px)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}></div>
            {deleteFilmActive &&<>
                <div className="edit-profile"></div>
                <div className="edit">{deleteFilmPrompt()}</div>
            </>}
            {editFilmActive &&<>
                <div className="edit-profile"></div>
                <div className="edit">{editFilmPrompt()}</div>
            </>}
            {reviewFilmActive &&<>
                <div className="edit-profile"></div>
                <div className="edit">{addReviewPrompt()}</div>
            </>}
            {useNavBar()}
            {displayFilm()}
            {displayReviews()}
            {similarFilms()}
        </div>
    );

}
export default Film;