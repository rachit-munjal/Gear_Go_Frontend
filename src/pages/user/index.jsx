import { Outlet } from "react-router-dom";

const Profile = () => {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Profile;
