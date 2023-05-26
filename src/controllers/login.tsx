import {Avatar, Box, Button, Grid, Link, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useState} from "react";
import {getActiveUser, loginUser} from "../models/users.data";

export const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [message, setError] = useState('');

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const login:userLogin = {email: email, password: password};
        await loginUser(login);
        const user = getActiveUser();
        if (user != null) {
            window.location.assign('/profile');
        } else {
            setError('Invalid email or password')
        }
    }
    if (getActiveUser() != null) {
        window.location.assign('/');
    }
    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: '#800000' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{color:'white'}}>
                Sign in
            </Typography>
            <Typography variant="body1" sx={{color:'#800000'}}>
                {message}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
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
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
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
                        setPassword(event.target.value);
                    }}
                    color= "error"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor:'#800000'}}
                >
                    Sign In
                </Button>
                <Grid container justifyContent="flex-end">
                    <Link onClick={event => {window.location.assign('/')}} variant="body2" sx={{color:'#800000', textDecorationColor:'#800000' }}>
                        Continue as a guest
                    </Link>
                </Grid>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link onClick={event => {window.location.assign('/register')}} variant="body2" sx={{color:'#800000', textDecorationColor:'#800000' }}>
                            Don't have an account? Register by clicking here.
                        </Link>
                    </Grid>
                </Grid>
            </Box>
      </Box>
    );

}