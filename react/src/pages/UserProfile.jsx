import {useState, useEffect} from "react"
import '../../src/index.css'
import PhotoGridItem from "../components/PhotoGridItem"
import PostDetails from "../components/PostDetails"

function UserProfile({ user }) {
    const [userPosts, setUserPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null)
    const [addPhoto, setAddPhoto] = useState(false)
    const [selectedPark, setSelectedPark] = useState(""); 
    const [caption, setCaption] = useState("")
    const [file, setFile] = useState(null)

    const parks = [
      "Arches National Park",
      "Badlands National Park",
      "Big Bend National Park",
      "Biscayne National Park",
      "Black Canyon of the Gunnison National Park",
      "Bryce Canyon National Park",
      "Canyonlands National Park",
      "Capitol Reef National Park",
      "Carlsbad Caverns National Park",
      "Channel Islands National Park",
      "Congaree National Park",
      "Crater Lake National Park",
      "Cuyahoga Valley National Park",
      "Death Valley National Park",
      "Denali National Park",
      "Dry Tortugas National Park",
      "Everglades National Park",
      "Gates of the Arctic National Park",
      "Gateway Arch National Park",
      "Glacier Bay National Park",
      "Glacier National Park",
      "Grand Canyon National Park",
      "Grand Teton National Park",
      "Great Basin National Park",
      "Great Sand Dunes National Park",
      "Great Smoky Mountains National Park",
      "Guadalupe Mountains National Park",
      "Haleakalā National Park",
      "Hawaiʻi Volcanoes National Park",
      "Hot Springs National Park",
      "Indiana Dunes National Park",
      "Isle Royale National Park",
      "Joshua Tree National Park",
      "Katmai National Park",
      "Kenai Fjords National Park",
      "Kings Canyon National Park",
      "Kobuk Valley National Park",
      "Lake Clark National Park",
      "Lassen Volcanic National Park",
      "Mammoth Cave National Park",
      "Mesa Verde National Park",
      "Mount Rainier National Park",
      "National Park of American Samoa",
      "New River Gorge National Park and Preserve",
      "North Cascades National Park",
      "Olympic National Park",
      "Petrified Forest National Park",
      "Pinnacles National Park",
      "Redwood National Park",
      "Rocky Mountain National Park",
      "Saguaro National Park",
      "Sequoia National Park",
      "Shenandoah National Park",
      "Theodore Roosevelt National Park",
      "Virgin Islands National Park",
      "Voyageurs National Park",
      "White Sands National Park",
      "Wind Cave National Park",
      "Wrangell—St. Elias National Park",
      "Yellowstone National Park",
      "Yosemite National Park",
      "Zion National Park"
    ]

    console.log(addPhoto);

    useEffect(() => {
        fetch(`http://localhost:5555/users/${user.id}`)
          .then((res) => res.json())
          .then((data) => setUserPosts(data.posts))
          .catch((error) => console.error("Error fetching posts:", error));
      }, [selectedPost]);

      function handlePhotoClick(clickedPost) {
        setSelectedPost(clickedPost);
        console.log('click');
      };

      function handleAddPhotoClick() {
        console.log('click');
        setAddPhoto(!addPhoto)
        console.log(addPhoto);
      }

      function handleSubmit(e) {
        e.preventDefault();
        console.log('click');
      
        const formData = new FormData();
        formData.append('file', file);
        formData.append(
          'json_data',
          JSON.stringify({
            caption: caption,
            user_id: user.id,
            park_id: parks.indexOf(selectedPark) + 1,
          })
        );
      
        fetch('http://localhost:5555/upload', {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log('Post uploaded:', data);
          })
          .catch((error) => {
            console.error('Error uploading post:', error);
            // Handle error, show error message, etc.
          });
      }
      

  return (
  <div className="mt-4">
  <h1 className="text-2xl font-bold text-red-500">{user.username}'s profile</h1>
  <button className="bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full" onClick={handleAddPhotoClick}>
  {addPhoto ? 'Go back' : 'Add photo' }
  </button>
  {addPhoto ? (
    <div>
      <form className="mt-4">
        <input
          type="file"
          accept="image/png, image/jpeg"
          name="photo"
          className="mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Caption"
          className="input-field mb-2"
          name="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <select
          value={selectedPark}
          onChange={(e) => setSelectedPark(e.target.value)}
          className="input-field mb-2"
          >
          <option value="" disabled>Select a park</option>
          {parks.map((park) => (
              <option key={park} value={park}>{park}</option>
          ))}
        </select>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Post
        </button>
      </form>
    </div>
  ) : selectedPost ? (
    <PostDetails post={selectedPost} setSelectedPost={setSelectedPost} user={user} />
  ) : (
    
    <div className="grid grid-cols-3 gap-4 mt-4 w-81" >
      {userPosts.map((post) => (
        <PhotoGridItem key={post.id} post={post} handlePhotoClick={handlePhotoClick} />
      ))}
    </div>
  )}
</div>)
}

export default UserProfile;
