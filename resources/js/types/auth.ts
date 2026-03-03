export type authProps = {
    auth: {
        user: {
            roles: string[];
        };
    } | null;
};


export type LoginForm = {
    email: string
    password: string
    remember: boolean
}

export interface LoginProps {
    status?: string
    canResetPassword: boolean
}