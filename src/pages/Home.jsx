import Posts from "../components/posts/Posts";
import NewPost from "../components/posts/NewPost";
import Stories from "../components/stories/Stories";

// The shell already provides the 600px bordered feed column.
function Home() {
  return (
    <>
      <Stories />
      <NewPost />
      <Posts />
    </>
  );
}

export default Home;
