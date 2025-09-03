import { API_URL_EWS } from "./constants";

export const createBooking = async (data) => {
    try {
        // console.log("Booking Data: ", data);

        const response = await fetch(`${API_URL_EWS}/api/bookings/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${localStorage.getItem("eWauthToken")}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return { message: "Booking Added Successfully", ok: true };
        }

        throw Error("Failed to add booking");
    } catch (error) {
        return { error: error.message };
    }
};

export const deleteBooking = async (id) => {
    try {
        const response = await fetch(`${API_URL_EWS}/api/bookings/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `${localStorage.getItem("eWauthToken")}`,
            },
        });

        if (response.ok) {
            return { message: "Booking Deleted Successfully", ok: true };
        }

        throw Error("Failed to delete booking");
    } catch (error) {
        return { error: error.message };
    }
};
