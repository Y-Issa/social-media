import Composer from "./Composer";
import { createPost } from "../../queries/posts";

function NewPost() {
  return <Composer createFn={createPost} invalidateKeys={[["posts"]]} />;
}

export default NewPost;
