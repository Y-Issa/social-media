import Composer from "../posts/Composer";
import { createGroupPost } from "../../queries/groups";

function CreateGroupPost({ groupId }) {
  return (
    <Composer
      createFn={(post) => createGroupPost({ groupId, post })}
      invalidateKeys={[["GroupPosts", groupId]]}
      placeholder="Share something with the group"
    />
  );
}

export default CreateGroupPost;
