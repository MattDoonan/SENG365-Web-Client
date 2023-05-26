import {
    Avatar,
    Box,
    Button,
    Grid, IconButton,
    InputAdornment,
    Link, Menu, MenuItem,
    TextField,
    Typography
} from "@mui/material";
import {
    getActiveUser,
    loginUser,
    registerUser,
    setCurrentPhoto,
} from "../models/users.data";
import {ChangeEvent, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import * as React from "react";



export const Register = () => {

    const [message, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const userSignup:userRegister = {firstName:firstName, lastName:lastName, email:email, password:password};
        const status:string= await registerUser(userSignup);
        if (status === 'Created') {
            const login:userLogin = {email: email, password: password};
            await loginUser(login);
            if (selectedImage != null) {
                await setCurrentPhoto(selectedImage);
            }
            window.location.assign('/profile');
        } else {
            setError(status);
        }
    }

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);


    if (getActiveUser() != null) {
        window.location.assign('/');
    }

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setSelectedImage(file);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const removePhoto = async () => {
        setSelectedImage(null);
        setAnchorEl(null);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <Box
            sx={{
                marginTop: 8,
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
                Sign up
            </Typography>
            <Typography variant="body1" sx={{color:'#800000'}}>
                {message}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="First Name"
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
                                setFirstName(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Last Name"
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
                        <TextField
                            required
                            fullWidth
                            label="Password"
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
                                setPassword(event.target.value);
                                setIsPasswordValid(event.target.value.length > 5)
                            }}
                            error={!isPasswordValid}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor:'#800000'}}
                >
                    Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                    <Link onClick={event => {window.location.assign('/')}} variant="body2" sx={{color:'#800000', textDecorationColor:'#800000' }}>
                        Continue as a guest
                    </Link>
                </Grid>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link onClick={event => {window.location.assign('/login')}} variant="body2" sx={{color:'#800000', textDecorationColor:'#800000' }}>
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}