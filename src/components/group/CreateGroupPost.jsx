import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  FormControl,
  HStack,
  Img,
  Input,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { createGroupPost, uploadImage } from "../../queries/groups";

function CreateGroupPost({ groupId }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(createGroupPost, {
    onSuccess: () => {
      setDescription("");
      queryClient.invalidateQueries(["groupPosts", groupId]);
    },
    onError: (error) => {
      console.error("Error creating group post:", error);
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    let imageUrl = "";
    if (file) {
      try {
        imageUrl = await uploadImage(file);
      } catch (err) {
        console.error("Error uploading image:", err);
        return;
      }
    }
    mutation.mutate({ groupId, post: { description, image: imageUrl } });
    setDescription("");
    setFile(null);
  }

  return (
    <Card
      mb="30px"
      color="textColor.100"
      bgColor="bgColor.50"
      borderRadius="2xl"
      mx={{ base: "10px", lg: "35px" }}
    >
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <CardBody>
            <HStack>
              <Avatar size="md" src={user.profileImage} />
              <Textarea
                placeholder="What's on your mind?"
                bgColor="bgColor.50"
                focusBorderColor="primary.100"
                border="none"
                resize="none"
                alignContent="center"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {file && (
                <Img
                  src={URL.createObjectURL(file)}
                  alt="post"
                  w="150px"
                  borderRadius="xl"
                />
              )}
            </HStack>
          </CardBody>
          <CardFooter>
            <HStack w="full">
              <Button
                variant="ghost"
                textColor="textColor.200"
                _hover={{ bgColor: "bgColor.100" }}
                onClick={() => document.getElementById("file").click()}
              >
                Add Image
                <Input
                  type="file"
                  id="file"
                  display="none"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>
              <Button
                variant="ghost"
                textColor="textColor.200"
                _hover={{ bgColor: "bgColor.100" }}
              >
                Add Place
              </Button>
              <Button
                variant="ghost"
                textColor="textColor.200"
                _hover={{ bgColor: "bgColor.100" }}
              >
                Tag Friends
              </Button>
              <Spacer />
              <Button
                type="submit"
                bgColor="primary.500"
                color="primary.50"
                _hover={{ bgColor: "primary.600" }}
              >
                Post
              </Button>
            </HStack>
          </CardFooter>
        </FormControl>
      </Form>
    </Card>
  );
}

export default CreateGroupPost;
