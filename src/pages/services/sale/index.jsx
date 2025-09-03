import { useState, useEffect } from "react";
import { addSale, deleteSale, editSale } from "../../../utils/sales";
import { useNavigate } from "react-router-dom";

const Sale = ({ saleData, car }) => {
    const [formData, setFormData] = useState({
        discountPercentage: 0,
        saleDate: "",
    });

    useEffect(() => {
        if (saleData) {
            setFormData({
                discountPercentage: saleData.discountPercentage,
                saleDate: saleData.saleDate,
            });
        }
    }, [saleData]);

    const convert = (currDate) => {
        if (!currDate) return "";

        const date = new Date(currDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleInputChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            discountPercentage: e.target.value.trim(),
        }));
    };

    const handleDateChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            saleDate: e.target.value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (new Date(formData.saleDate) < new Date()) {
            alert("Sale Date should be greater than current date");
            return;
        }

        if (
            formData.discountPercentage < 1 ||
            formData.discountPercentage > 100
        ) {
            alert("Discount should be between 1 and 100");
            return;
        }

        try {
            const response = !saleData
                ? await addSale(formData, car)
                : await editSale(formData, saleData._id);

            if (response.ok) {
                alert(response.message);
                navigate(`/car/${car}`);
            } else {
                alert(response.error);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to add sale");
        }
    };

    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this sale?")) {
            return;
        }

        try {
            const response = await deleteSale(saleData._id);

            if (response.ok) {
                alert(response.message);
                navigate(`/car/${car}`);
            } else {
                alert(response.error);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete sale");
        }
    };

    return (
        <div className="flex flex-col gap-1 items-center justify-center">
            <form className="w-full">
                <table className="table-fixed w-full border-collapse border border-gray-300 shadow-lg">
                    <thead
                        style={{
                            fontFamily: "SuperBrigadeCondensed",
                            letterSpacing: "0.1rem",
                        }}
                    >
                        <tr className="bg-black text-white">
                            <th className="p-4 w-1/2 md:w-1/4 text-left">
                                Attribute
                            </th>
                            <th className="p-4 w-3/4 text-left">Details</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontFamily: "Montserrat" }}>
                        <tr>
                            <td className="border p-4 font-semibold">
                                Discount Percetange (in %)
                            </td>
                            <td className="border p-4">
                                <input
                                    type="number"
                                    name="title"
                                    min={1}
                                    max={100}
                                    value={formData.discountPercentage}
                                    onChange={handleInputChange}
                                    className="w-full border p-2"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border p-4 font-semibold">
                                Sale Expiry Date
                            </td>
                            <td className="border p-4">
                                <input
                                    name="description"
                                    type="date"
                                    value={convert(formData.saleDate)}
                                    onChange={handleDateChange}
                                    className="w-full border p-2"
                                ></input>
                            </td>
                        </tr>
                        <tr></tr>
                    </tbody>
                </table>
            </form>
            <div
                onClick={handleFormSubmit}
                className="w-full rounded-md text-center border p-4 font-bold bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            >
                {!saleData ? "Add" : "Update"} Sale
            </div>
            {saleData && (
                <div
                    onClick={handleDelete}
                    className="w-full rounded-md text-center border p-4 font-bold bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                    Delete Sale
                </div>
            )}
        </div>
    );
};

export default Sale;
