import { API_URL_EWS } from "./constants";

export const addSale = async (data, car) => {
    try {
        const newData = { ...data, car };

        // console.log("Data :- ", newData);

        const response = await fetch(`${API_URL_EWS}/api/sales/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${localStorage.getItem("eWauthToken")}`,
            },
            body: JSON.stringify(newData),
        });

        if (response.ok) {
            return { message: "Sale Added Successfully", ok: true };
        }

        throw Error("Failed to add sale");
    } catch (error) {
        return { error: error.message };
    }
};

export const editSale = async (data, id) => {
    try {
        const response = await fetch(`${API_URL_EWS}/api/sales/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${localStorage.getItem("eWauthToken")}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return { message: "Sale Updated Successfully", ok: true };
        }

        throw Error("Failed to update sale");
    } catch (error) {
        return { error: error.message };
    }
};

export const deleteSale = async (id) => {
    try {
        const response = await fetch(`${API_URL_EWS}/api/sales/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${localStorage.getItem("eWauthToken")}`,
            },
        });

        if (response.ok) {
            return { message: "Sale Deleted Successfully", ok: true };
        }

        throw Error("Failed to delete sale");
    } catch (error) {
        return { error: error.message };
    }
};
