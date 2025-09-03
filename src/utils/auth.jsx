import { API_URL_EWS } from "./constants";

export const createUser = async (details) => {
    if (
        !details.name ||
        !details.email ||
        !details.password ||
        !details.confirmPassword
    ) {
        throw Error("Please fill in all fields");
    }

    if (details.password !== details.confirmPassword) {
        throw Error("Passwords do not match");
    }

    const response = await fetch(`${API_URL_EWS}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
    });

    const data = await response.json();

    if (data.error) {
        throw Error(data.error);
    }

    localStorage.setItem("eWauthToken", data.data.token);

    return { message: "User Created Successfully", user: data.data.user };
};

export const signUser = async (details) => {
    if (!details.email || !details.password) {
        throw Error("Please fill in all fields");
    }

    const response = await fetch(`${API_URL_EWS}/api/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
    });

    const data = await response.json();

    if (data.error) {
        throw Error(data.error);
    }

    localStorage.setItem("eWauthToken", data.data.token);

    return { message: "User Login Successfull", user: data.data.user };
};

export const verifyToken = async (token) => {
    const response = await fetch(`${API_URL_EWS}/api/auth/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("eWauthToken")}`,
        },
        body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (data.error) {
        throw Error(data.error);
    }

    return { ok: "Valid Token", role: data.user.role, _id: data.user.userId };
};
