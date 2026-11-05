import Posts from "../components/posts/Posts";
import NewPost from "../components/posts/NewPost";

// The shell already provides the 600px bordered feed column.
function Home() {
  return (
    <>
      <NewPost />
      <Posts />
    </>
  );
}

export default Home;
