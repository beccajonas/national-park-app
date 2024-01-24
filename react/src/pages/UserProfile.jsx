import {useState, useEffect} from "react"
import '../../src/index.css'
import PhotoGridItem from "../components/PhotoGridItem"
import PostDetails from "../components/PostDetails"

function UserProfile({ user }) {
    const [userPosts, setUserPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:5555/users/${user.id}`)
          .then((res) => res.json())
          .then((data) => setUserPosts(data.posts))
          .catch((error) => console.error("Error fetching posts:", error));
      }, []);

      function handlePhotoClick(clickedPost) {
        setSelectedPost(clickedPost);
        console.log('click');
      };

      return (
        <div>
          <h1 className="text-2xl font-bold text-red-500">{user.username}'s profile</h1>
          {selectedPost ? (
            <PostDetails post={selectedPost} setSelectedPost={setSelectedPost} />
          ) : (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {userPosts.map((post) => (
                <PhotoGridItem key={post.id} post={post} handlePhotoClick={handlePhotoClick} />
              ))}
            </div>
          )}
        </div>
      );
    }
    


export default UserProfile