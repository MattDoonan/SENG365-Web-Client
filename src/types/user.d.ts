type userRegister = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

type userLogin = {
    email: string,
    password: string
}

type userLoggedIn = {
    userId:number,
    token:string
}

type updateUserNoPassword = {
    firstName: string,
    lastName: string,
    email: string,
}

type updateUserPassword = {
    password:string,
    currentPassword: string
} & updateUserNoPassword


type activeUser = {
    firstName: string,
    lastName: string,
    email: string,
}