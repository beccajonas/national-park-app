import {useState, useEffect} from "react"

function UserProfile({ user }) {
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5555/users/${user.id}`)
          .then((res) => res.json())
          .then((data) => setUserPosts(data.posts))
          .catch((error) => console.error("Error fetching posts:", error));
      }, [user.id]);

      console.log(userPosts);

    return (
        <div>
            <h1>{user.username} profile</h1>
        </div>
    )
}


export default UserProfile