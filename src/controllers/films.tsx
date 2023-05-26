import * as React from 'react';
import Chip from '@mui/material/Chip';
import {getFilms, getGenres, getNumberOfPages} from "../models/films.data";
import '../css/searchFilms.css';
import '../css/film.css';
import '../css/global.css';
import {
    Autocomplete,
    FormControl,
    IconButton, Input,
    InputBase,
    InputLabel, MenuItem,
    Pagination,
    PaginationItem,
    Paper,
    Select, SelectChangeEvent,
    TextField
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {FormEvent} from "react";
import {useNavBar} from "./nav";
import DisplayListOfFilms from "./displayListOfFilms";

const Films = () => {

    const [films, setFilms] = React.useState < Array < film >> ([])
    const [genres, setGenres] = React.useState < Array < genre >> ([])
    const [searchParams, setSearch] = React.useState('')
    const [searchQuery, setSearchQuery] = React.useState('')
    const [filterAge, setAge] = React.useState <Array < String >> ([]);
    const [filterGenre, setGenre] = React.useState <Array < Number >> ([]);
    const [sortBy, setSort] = React.useState('RELEASED_ASC');
    const [page, setPage] = React.useState(0);
    const [numberOfPages, setMaxPages] = React.useState(0);


    React.useEffect(() => {
        async function getAllGenres () {
            setGenres(await getGenres());
        }
        getAllGenres()
    }, []);

    React.useEffect(() => {
        async function getAllFilms () {
            setMaxPages(Math.floor(await getNumberOfPages(searchParams, filterAge, filterGenre)));
            setFilms(await getFilms(searchParams, filterAge, filterGenre, sortBy, (page * 10)));
        }
        getAllFilms()
    }, [searchParams, filterAge, filterGenre, sortBy, page]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPage(0);
        setSearch(searchQuery);
    };


    const searchBar = () => {
        return (
            <Paper className="filters">
                <FormControl component="form" onSubmit={handleSubmit}>
                    <div className="search-bar">
                        <InputBase
                            sx={{
                                ml: 1,
                                color: 'black',
                                backgroundColor: 'transparent',
                                width: '75%',
                                borderBottom: 'solid #800000 1px',
                            }}
                            placeholder="Search film"
                            inputProps={{ 'aria-label': 'search film' }}
                            onChange={event => setSearchQuery(event.target.value)}
                        />
                        <IconButton type="submit" sx={{
                            ml: 1,
                            flex: 1,
                            color: '#800000',
                        }}>
                            <SearchIcon />
                        </IconButton>
                    </div>
                </FormControl>
                <div className="filter-objects">
                    <div>
                        <Autocomplete
                            multiple
                            options={genres}
                            className="filter"
                            getOptionLabel={(option) => option.name}
                            renderTags={(value: genre[], getTagProps) =>
                                value.map((option: genre, index: number) => (
                                    <Chip label={option.name} {...getTagProps({ index })} className="small-basic-info"/>
                                ))
                            }
                            onChange={(event, value) => {
                                const genreIds = value.map((genre) => genre.genreId);
                                setPage(0);
                                setGenre(genreIds);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Filter genres"
                                    color= "error"
                                    InputLabelProps={{
                                        style: { color: "#868686" },
                                    }}
                                    placeholder="Search genres"
                                    sx={{
                                        color: "white",
                                        "& .MuiAutocomplete-inputRoot": {
                                            color: "white",
                                        }
                                    }}
                                />
                            )}
                        />
                    </div>
                    <FormControl>
                        <InputLabel color= "error" sx = {{color:"#868686"}}>Filter by age</InputLabel>
                        <Select
                            multiple
                            value={filterAge}
                            className="filter"
                            color= "error"
                            onChange={(event:SelectChangeEvent<String[]>) => {
                                const value = event.target.value;
                                const newValue = Array.isArray(value) ? value : [value];
                                setPage(0);
                                setAge(newValue);
                            }}
                            input={<Input id="select-multiple-chip" />}
                            label="Genre"
                            renderValue={(selected: any[]) => (
                                <div className="selected-input">
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} className="small-basic-info" />
                                    ))}
                                </div>
                            )}
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
                    <FormControl>
                        <InputLabel htmlFor="age-native-simple" color= "error">Sort by</InputLabel>
                        <Select
                            native
                            value={sortBy}
                            variant="standard"
                            className="filter"
                            color= "error"
                            onChange={(event:SelectChangeEvent<string>) => {
                                setSort(event.target.value);
                            }}
                        >
                            <option value={"ALPHABETICAL_ASC"}>Title: A-Z</option>
                            <option value={"ALPHABETICAL_DESC"}>Title: Z-A</option>
                            <option value={"RELEASED_ASC"}>Release: ASC</option>
                            <option value={"RELEASED_DESC"}>Release: DESC</option>
                            <option value={"RATING_DESC"}>Rating: High-Low</option>
                            <option value={"RATING_ASC"}>Rating: Low-High</option>
                        </Select>
                    </FormControl>
                </div>
            </Paper>
        );
    };

    const pagination = () => {
        return (
            <Pagination
                count={numberOfPages + 1}
                showFirstButton
                showLastButton
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
                renderItem={(item) => (
                    <PaginationItem
                        {...item}
                        sx={{
                            color: 'white',
                            backgroundColor: '#800000',
                            marginBottom: '1rem',
                            '&.Mui-selected': {
                                color: 'white',
                                backgroundColor: '#1a1a1a',
                            },
                        }}
                    />
                )}
            />
        );
    }
    return (
        <div>
            {useNavBar()}
            <div className="view-film">
                <div className="filter-items">
                    {searchBar()}
                </div>
                <div className="pages">
                    {pagination()}
                </div>
                <div className="search-films-display">
                    <DisplayListOfFilms films = {films} error={"No results"}/>
                </div>
            </div>
        </div>
    );
};

export default Films;