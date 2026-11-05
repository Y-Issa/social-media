import Composer from "../posts/Composer";
import { createGroupPost } from "../../queries/groups";
import { postKeys } from "../../queries/postCache";

function CreateGroupPost({ groupId }) {
  return (
    <Composer
      createFn={(post) => createGroupPost({ groupId, post })}
      invalidateKeys={[postKeys.group(groupId)]}
      placeholder="Share something with the group"
    />
  );
}

export default CreateGroupPost;
