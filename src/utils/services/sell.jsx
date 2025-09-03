import { API_URL_EWS } from "../constants";

export const sellCar = async (data) => {
    try {
        const request = await fetch(`${API_URL_EWS}/api/cars/`, {
            method: "POST",
            body: data,
            headers: {
                Authorization: `${localStorage.getItem("eWauthToken")}`,
            },
        });

        const response = await request.json();

        // console.log(response);

        return { ...response, ok: request.ok };
    } catch (err) {
        console.error(err);
    }
};
