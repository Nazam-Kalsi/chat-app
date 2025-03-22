import axios from "axios";
import React from "react";

type Props = {
    user: any;
};

const addFriend = async (user: any) => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_URL}/api/chat/create-chat/${user._id}`,
            {},
            {withCredentials: true}
        );
        console.log(res);
    } catch (error) {
        console.log(error);
    }
};
function SearchModal({ user }: Props) {
    return (
        <div>
            {user.map((u: any) => {
                return (
                    <div className="p-2">
                        {u.userName}
                        <button onClick={() => addFriend(u)}>+</button>
                    </div>
                );
            })}
        </div>
    );
}

export default SearchModal;
