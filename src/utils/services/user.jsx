import { API_URL_EWS } from "../constants";

export const getUser = async (id) => {
    try {
        const response = await fetch(`${API_URL_EWS}/api/auth/${id}`, {
            method: "GET",
            headers: {
                Authorization: `${localStorage.getItem("eWauthToken")}`,
            },
        }).then((res) => res.json());

        // console.log("Response", response);

        return {
            user: response.user,
            ok: true,
        };
    } catch (error) {
        return {
            message: "Error fetching user",
        };
    }
};

export const userBookings = async (id) => {
    try {
        const response = await fetch(
            `${API_URL_EWS}/api/bookings/user/${id}?type=Buy`,
            {
                method: "GET",
                headers: {
                    Authorization: `${localStorage.getItem("eWauthToken")}`,
                },
            }
        ).then((res) => res.json());

        // console.log("Response", response);

        return {
            bookings: response.bookings,
            ok: true,
        };
    } catch (error) {
        return {
            message: "Error fetching user bookings",
        };
    }
};

export const userRentals = async (id) => {
    try {
        const response = await fetch(
            `${API_URL_EWS}/api/bookings/user/${id}?type=Rent`,
            {
                method: "GET",
                headers: {
                    Authorization: `${localStorage.getItem("eWauthToken")}`,
                },
            }
        ).then((res) => res.json());

        // console.log("Response", response);

        return {
            rentals: response.bookings,
            ok: true,
        };
    } catch (error) {
        return {
            message: "Error fetching user rentals",
        };
    }
};

export const userSales = async (id) => {
    try {
        const response = await fetch(`${API_URL_EWS}/api/cars/${id}`, {
            method: "GET",
            headers: {
                Authorization: `${localStorage.getItem("eWauthToken")}`,
            },
        }).then((res) => res.json());

        // console.log("Response", response);

        return {
            sales: response.sales,
            ok: true,
        };
    } catch (error) {
        return {
            message: "Error fetching user sales",
        };
    }
};
