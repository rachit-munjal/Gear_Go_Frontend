import { API_URL_EWS } from "../constants";

export const editCar = async (data, id) => {
    try {
        const request = await fetch(`${API_URL_EWS}/api/cars/${id}`, {
            method: "PUT",
            body: data,
            headers: {
                "Authorization": `${localStorage.getItem("eWauthToken")}`,
            },
        });

        const response = await request.json();

        return { ...response, ok: request.ok };
    } catch (err) {
        console.error(err);
    }
};

export const deleteCar = async (carId) => {
    try {
        const request = await fetch(`${API_URL_EWS}/api/cars/${carId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `${localStorage.getItem("eWauthToken")}`,
            },
        });

        const response = await request.json();

        return { ...response, ok: request.ok };
    } catch (err) {
        console.error(err);
    }
};
