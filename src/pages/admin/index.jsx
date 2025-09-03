import { Outlet } from "react-router-dom";

const Admin = () => {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Admin;
