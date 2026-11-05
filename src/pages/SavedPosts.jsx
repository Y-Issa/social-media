import Posts from "../components/posts/Posts";
import PageHeader from "../components/ui/PageHeader";

// Saved posts, newest save first. Group posts show which group they're from.
function SavedPosts() {
  return (
    <>
      <PageHeader title="Saved" />
      <Posts saved />
    </>
  );
}

export default SavedPosts;
