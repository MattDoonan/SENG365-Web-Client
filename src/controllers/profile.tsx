import {useNavBar} from "./nav";
import * as React from "react";
import {
    getActiveUserInformation,
    getUserDirectedFilms,
    getUserReviewedFilms,
    logoutActiveUser, removeUserPhoto, setCurrentPhoto, updateUserInfo
} from "../models/users.data";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PersonIcon from "@mui/icons-material/Person";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton, Input,
    InputAdornment, InputLabel,
    List,
    Menu,
    MenuItem, Select, SelectChangeEvent,
    TextField
} from "@mui/material";
import {getUrl} from "../models/url.data";
import Typography from "@mui/material/Typography";
import '../css/userProfile.css';
import CardActions from "@mui/material/CardActions";
import VideocamIcon from '@mui/icons-material/Videocam';
import ReviewsIcon from '@mui/icons-material/Reviews';
import {ChangeEvent, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import DisplayListOfFilms from "./displayListOfFilms";
import Chip from "@mui/material/Chip";
import {deleteFilm, getGenres, postFilmImage, postNewFilm} from "../models/films.data";
import CardMedia from "@mui/material/CardMedia";


const Profile = () => {

    const [activeUser, setActiveUser] = React.useState<activeUser>();
    const [filmsReviewed, setFilmsReviewed] = React.useState < Array < film >> ([])
    const [filmsMade, setFilmsMade] = React.useState < Array < film >> ([])
    const [editModeActive, setEditModeActive] = useState(false);
    const [createFilmActive, setCreateFilmActive] = useState(false);
    const [message, setError] = useState('');
    const [filmMessage, setFilmError] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [removeImage, setRemoveImage] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [currentImage, setCurrentImage] = useState<string | null>(getUrl() + '/users/' + localStorage.getItem('user_id') + '/image');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedFilmImage, setSelectedFilmImage] = useState<File | null>(null);
    const [genres, setGenres] = React.useState <Array<genre>>([]);
    const [newFilmAge, setAge] = React.useState < string > ('TBC');
    const [newFilmGenre, setGenre] = React.useState < number | null > ();
    const [newFilmRuntime, setNewFilmRuntime] = React.useState < number > ();
    const [newFilmTitle, setNewFilmTitle] = React.useState < string > ();
    const [newFilmDescription, setNewFilmDescription] = React.useState < string > ();
    const [newFilmDate, setNewFilmDate] = React.useState < string > ();


    React.useEffect(() => {
        async function getAllGenres () {
            setGenres(await getGenres());
        }
        getAllGenres()
    }, []);

    React.useEffect(() => {
        async function getUser () {
            const userInfo:activeUser = await getActiveUserInformation();
            if (userInfo == null) {
                await logoutActiveUser();
                window.location.assign('/');
            } else {
                setActiveUser(userInfo);
                setEmail(userInfo.email);
                setFirstName(userInfo.firstName);
                setLastName(userInfo.lastName);
                setFilmsMade(await getUserDirectedFilms());
                setFilmsReviewed(await getUserReviewedFilms());
            }
        }
        getUser()
    }, [editModeActive, createFilmActive]);

    const userProfile = () => {
        return (
            <Card className="user-profile-info" sx={{margin: 'auto', marginTop: '50px', position: 'relative'}}
                  elevation={0}>
                <Typography variant="h4" className="description">
                    {"Profile"}
                </Typography>
                <CardContent className="user-profile-content">
                    <CardActions style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Avatar sx={{m: 1, bgcolor: '#800000', width: 80, height: 80}}>
                                {currentImage ? (
                                    <img src={currentImage} onError={() => {setCurrentImage(null)}} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <PersonIcon style={{ width: '40%', height: '40%', objectFit: 'cover' }} />
                                )}
                            </Avatar>
                            <CardContent>
                                <Typography variant="h5" className="description">
                                    {activeUser?.firstName + ' ' + activeUser?.lastName}
                                </Typography>
                                <Typography variant="body1" className="description">
                                    {activeUser?.email}
                                </Typography>
                            </CardContent>
                        </div>
                        <Button variant="contained" onClick={event => setEditModeActive(true)} disableElevation style={{
                            right: 0,
                            top: 42,
                            width: 100,
                            height: 35,
                            fontSize: 10,
                            position: 'absolute',
                            backgroundColor: '#800000'
                        }}>
                            Edit profile
                        </Button>
                    </CardActions>
                    <CardActions className="user-fun-info">
                        <Typography variant="body2" className="description facts"
                                    style={{display: 'flex', alignItems: 'center'}}>
                            <VideocamIcon style={{marginRight: '8px'}}/>
                            {filmsMade.length} films directed
                        </Typography>
                        <Typography variant="body2" className="description facts"
                                    style={{display: 'flex', alignItems: 'center'}}>
                            <ReviewsIcon style={{fontSize: 20, marginRight: '8px'}}/>
                            {filmsReviewed.length} films reviewed
                        </Typography>
                    </CardActions>
                </CardContent>
            </Card>
        )
    }
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        let status:string = 'OK';
        if (newPassword !== '' && oldPassword === '') {
            setError('Please enter your current password');
        } else if (newPassword === '' && oldPassword !== '') {
            setError('Please enter a new password');
        } else if (newPassword !== '' && oldPassword !== '') {
            const userSignup:updateUserPassword = {firstName:firstName, lastName:lastName, email:email, password:newPassword, currentPassword:oldPassword};
            status = await updateUserInfo(userSignup);
        } else {
            const userSignup:updateUserNoPassword = {firstName:firstName, lastName:lastName, email:email};
            status = await updateUserInfo(userSignup);
        }
        if (status === 'OK') {
            if (selectedImage != null) {
                await setCurrentPhoto(selectedImage);
                setCurrentImage(URL.createObjectURL(selectedImage))
            } else if (removeImage) {
                await removeUserPhoto();
                setCurrentImage(null);
            }
            setEditModeActive(false);
            setError('');
        } else {
            setError(status);
        }
    }

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setSelectedImage(file);
        setRemoveImage(false);
    };

    const handleImageUploadFilm = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setSelectedFilmImage(file);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const removePhoto = async () => {
        setSelectedImage(null);
        setAnchorEl(null);
        setRemoveImage(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const editProfile = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <label style={{ position: 'relative', display: 'inline-block', marginBottom:10}}>
                    <input
                        accept="image/*"
                        multiple
                        type="file"
                        style={{ display: 'none' }}
                        id="image-upload-input"
                        onChange={handleImageUpload}
                    />
                    <Avatar sx={{ m: 1, bgcolor: '#800000', width: 80, height: 80 }}>
                        {selectedImage ? (
                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : currentImage && !removeImage ? (
                            <img src={currentImage} onError={() => {setCurrentImage(null)}} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <PersonIcon style={{ width: '40%', height: '40%', objectFit: 'cover' }} />
                        )}
                    </Avatar>
                    <label>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            sx={{backgroundColor:'black'}}
                            style={{ position: 'absolute', bottom: 0, right: 0, fontSize: 10, padding:5 }}
                        >
                            <AddIcon style={{color:"white"}}/>
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            <label htmlFor="image-upload-input">
                                <MenuItem key={0} onClick={handleClose}>
                                    {"Upload file"}
                                </MenuItem>
                            </label>
                            <MenuItem key={0} onClick={removePhoto}>
                                {"Remove file"}
                            </MenuItem>
                        </Menu>
                    </label>
                </label>
                <Typography component="h1" variant="h5" sx={{color:'white'}}>
                    Edit profile
                </Typography>
                <Typography variant="body1" sx={{color:'red'}}>
                    {message}
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2} maxWidth={700}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="First Name"
                                autoFocus
                                type="text"
                                defaultValue={activeUser?.firstName}
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
                                    setFirstName(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Last Name"
                                type="text"
                                defaultValue={activeUser?.lastName}
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
                                    setLastName(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Email Address"
                                type="email"
                                defaultValue={activeUser?.email}
                                InputLabelProps={{
                                    style: { color: "white"},
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                                inputProps={{ style: { color: "white"} }}
                                onChange={event => {
                                    setEmail(event.target.value);
                                    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value);
                                    setIsEmailValid(isValid);
                                }}
                                error={!isEmailValid}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                onClick={event => {setEditPassword(!editPassword); setNewPassword(''); setOldPassword('')}}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor:'#800000'}}
                            >
                                {editPassword ? 'Hide password' : 'Change password'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} hidden={!editPassword}>
                            <TextField
                                required
                                fullWidth
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                sx={{color:'white'}}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                InputLabelProps={{
                                    style: { color: "white"},
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                                inputProps={{ style: { color: "white"} }}
                                onChange={event => {
                                    setNewPassword(event.target.value);
                                    setIsPasswordValid(event.target.value.length > 5)
                                }}
                                error={!isPasswordValid}
                            />
                        </Grid>
                        <Grid item xs={12} hidden={!editPassword}>
                            <TextField
                                required
                                fullWidth
                                label="Current Password"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                sx={{color:'white'}}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
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
                                    setOldPassword(event.target.value);
                                }}
                                error={!isPasswordValid}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                onClick={event => {setEditModeActive(false); setError('')}}
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

    const directedFilms = () => {
        if (filmsMade === null || filmsMade === undefined) {
            return <div/>;
        }
        return (
            <Card className="review-information" sx={{ margin: 'auto', marginTop: '50px', position: 'relative' }}>
                <Button variant="contained" onClick={event => setCreateFilmActive(true)} disableElevation style={{
                    right: 0,
                    top: 0,
                    width: 100,
                    height: 35,
                    fontSize: 10,
                    position: 'absolute',
                    backgroundColor: '#800000'
                }}>
                    Create film
                </Button>
                <CardContent>
                    <Typography variant="h6" className="description facts">
                        {"Directed films"}
                    </Typography>
                    <List className="the-reviews">
                        <DisplayListOfFilms films = {filmsMade} error={"You have directed no films"}/>
                    </List>
                </CardContent>
            </Card>
        );
    }

    const viewedFilms = () => {
        if (filmsMade === null || filmsMade === undefined) {
            return <div/>;
        }
        return (
            <Card className="review-information" sx={{ margin: 'auto', marginTop: '50px', position: 'relative' }}>
                <CardContent>
                    <Typography variant="h6" className="description facts">
                        {"Reviewed films"}
                    </Typography>
                    <List className="the-reviews">
                        <DisplayListOfFilms films = {filmsReviewed} error={"You have reviewed no films"}/>
                    </List>
                </CardContent>
            </Card>
        );
    }

    const handleNewFilm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (newFilmTitle == null || newFilmDescription == null || newFilmGenre == null || selectedFilmImage == null) {
            setFilmError('An image, title, description and genre is required to create a film');
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
        const response:postFilmResponse = await postNewFilm(newFilm);
        if (response.status === "Created" && response.id != null) {
            const filmImageResponse:postFilmResponse = await postFilmImage(response.id, selectedFilmImage);
            if (filmImageResponse.status === "Created") {
                console.log("valid film")
                setCreateFilmActive(false);
                setFilmError('');
                setNewFilmTitle(undefined);
                setNewFilmDescription(undefined);
                setNewFilmDate(undefined);
                setNewFilmRuntime(undefined);
                setAge('TBC');
                setGenre(undefined);
                setSelectedFilmImage(null);
            } else {
                console.log("Invalid image")
                await deleteFilm(response.id);
                setFilmError(filmImageResponse.status);
            }
        } else {
            console.log("Invalid film")
            setFilmError(response.status);
        }
    }
    const createFilm = () => {
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
                        image={selectedFilmImage ? URL.createObjectURL(selectedFilmImage) : undefined}
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
                    Create film
                </Typography>
                <Typography variant="body1" sx={{color:'red'}}>
                    {filmMessage}
                </Typography>
                <form onSubmit={handleNewFilm} style={{ marginTop: 5}}>
                    <Grid container spacing={2} maxWidth={700}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Title"
                                autoFocus
                                type="text"
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
                                onChange={event => {setNewFilmDate(event.target.value);}}
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
                                    renderTags={(value: genre[], getTagProps) =>
                                        value.map((option: genre, index: number) => (
                                            <Chip label={option.name} {...getTagProps({ index })} className="small-basic-info"/>
                                        ))
                                    }
                                    onChange={(event, value) => {
                                        setGenre(value ? value.genreId : null);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Select genre"
                                            required
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
                                        setAge(event.target.value.toString());
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
                                onClick={event => {setCreateFilmActive(false); setFilmError('')}}
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
                </form>
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
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getUrl()}/users/${localStorage.getItem('user_id')}/image)`,
                filter: 'blur(30px)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}></div>
            {editModeActive &&<>
                <div className="edit-profile"></div>
                <div className="edit">{editProfile()}</div>
            </>}
            {createFilmActive &&<>
                <div className="edit-profile"></div>
                <div className="edit">{createFilm()}</div>
            </>}
            {useNavBar()}
            {userProfile()}
            {directedFilms()}
            {viewedFilms()}
        </div>
    );
}

export default Profile;