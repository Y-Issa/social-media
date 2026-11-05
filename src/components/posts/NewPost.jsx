import Composer from "./Composer";
import { createPost } from "../../queries/posts";
import { postKeys } from "../../queries/postCache";

function NewPost() {
  return <Composer createFn={createPost} invalidateKeys={[postKeys.all]} />;
}

export default NewPost;
