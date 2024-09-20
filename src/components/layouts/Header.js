import { useState, useEffect } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { getAccessToken } from "../../utils/auth";
import config from "../../config";
function Header() {
    const [profile, setProfile] = useState([]);

    //show list data
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await api.get(url.AUTH.PROFILE, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
                setProfile(response.data.data);
                // console.log(response.data.data);
            } catch (error) { }
        };
        loadProfile();
    }, []);
    return (
        <></>
    );
}
export default Header;