import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function UpdateProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user, login } = useAuth();
  const [profileImage, setProfileImage] = useState(user.profileImage || "");
  const [coverImage, setCoverImage] = useState(user.coverImage || "");
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city);
  const [website, setWebsite] = useState(user.website);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isUpload, setIsUpload] = useState(false);

  async function uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newProfile) => {
      return makeRequest.put("/users", newProfile, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      const email = user.email;
      const password = newPassword ? newPassword : oldPassword;
      login({ email, password });
      setNewPassword("");
      setOldPassword("");

      toast({
        position: "top",
        title: "Success",
        description: "Profile updated successfully",
        status: "success",
        variant: "solid",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        position: "top",
        title: "Error",
        description: error.response.data || "An unknown error occurred",
        status: "error",
        variant: "left-accent",
        duration: 4000,
      });
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    let coverUrl = coverImage;
    let profileUrl = profileImage;

    if (isUpload) {
      coverUrl =
        coverImage instanceof File ? await uploadImage(coverImage) : coverUrl;
      profileUrl =
        profileImage instanceof File
          ? await uploadImage(profileImage)
          : profileUrl;
    }

    mutation.mutate({
      name,
      city,
      website,
      newPassword,
      oldPassword,
      coverImage: coverUrl,
      profileImage: profileUrl,
    });
    onClose();
  }

  return (
    <>
      <Button onClick={onOpen} mt="10px" colorScheme="primary">
        Update Profile
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent color="textColor.100" bgColor="bgColor.100" p="15px">
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <FormControl display="flex" alignItems="center">
                <FormLabel minW="75px">Name:</FormLabel>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  autoComplete="off"
                  isRequired
                  focusBorderColor="primary.100"
                  borderColor="bgColor.400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4} display="flex" alignItems="center">
                <FormLabel minW="75px">City:</FormLabel>
                <Input
                  type="text"
                  name="city"
                  placeholder="City"
                  autoComplete="off"
                  focusBorderColor="primary.100"
                  borderColor="bgColor.400"
                  value={city || ""}
                  onChange={(e) => setCity(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4} display="flex" alignItems="center">
                <FormLabel minW="75px">Website:</FormLabel>
                <Input
                  type="text"
                  name="website"
                  placeholder="Website"
                  autoComplete="off"
                  focusBorderColor="primary.100"
                  borderColor="bgColor.400"
                  value={website || ""}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4} display="flex" alignItems="center">
                <FormLabel minW="75px">Password:</FormLabel>
                <Input
                  type="password"
                  name="newPassword"
                  placeholder="New Password (optional)"
                  focusBorderColor="primary.100"
                  borderColor="bgColor.400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4} display="flex" alignItems="center">
                <FormLabel minW="75px">Confirm:</FormLabel>
                <Input
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password (required)"
                  isRequired
                  focusBorderColor="primary.100"
                  borderColor="bgColor.400"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </FormControl>
              {!isUpload && (
                <>
                  <FormControl mt={4} display="flex" alignItems="center">
                    <FormLabel maxW="75px">Profile Image:</FormLabel>
                    <Input
                      type="text"
                      name="profileImage"
                      placeholder="Profile Image"
                      autoComplete="off"
                      focusBorderColor="primary.100"
                      borderColor="bgColor.400"
                      value={
                        typeof profileImage === "string" ? profileImage : ""
                      }
                      onChange={(e) => setProfileImage(e.target.value)}
                    />
                  </FormControl>
                  <FormControl mt={4} display="flex" alignItems="center">
                    <FormLabel maxW="75px">Cover Image:</FormLabel>
                    <Input
                      type="text"
                      name="coverImage"
                      placeholder="Cover Image"
                      autoComplete="off"
                      focusBorderColor="primary.100"
                      borderColor="bgColor.400"
                      value={typeof coverImage === "string" ? coverImage : ""}
                      onChange={(e) => setCoverImage(e.target.value)}
                    />
                  </FormControl>
                </>
              )}
              <HStack mt={2}>
                <Checkbox
                  colorScheme="primary"
                  isChecked={isUpload}
                  onChange={(e) => setIsUpload(e.target.checked)}
                >
                  {isUpload ? "Links?" : "Upload?"}
                </Checkbox>
                {isUpload && (
                  <>
                    <FormControl display="flex" justifyContent="center">
                      <Button
                        variant="ghost"
                        colorScheme="primary"
                        onClick={() => {
                          document
                            .querySelector('input[name="profileImage"]')
                            .click();
                        }}
                      >
                        Profile Image
                        <Input
                          type="file"
                          name="profileImage"
                          placeholder="Profile Image"
                          focusBorderColor="primary.100"
                          borderColor="bgColor.400"
                          display="none"
                          onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                      </Button>
                    </FormControl>
                    <FormControl display="flex" justifyContent="center">
                      <VStack>
                        {coverImage && coverImage instanceof File && (
                          <Img
                            src={URL.createObjectURL(coverImage)}
                            alt="cover"
                            w="150px"
                            borderRadius="xl"
                          />
                        )}
                        <Button
                          variant="ghost"
                          colorScheme="primary"
                          onClick={() => {
                            document
                              .querySelector('input[name="coverImage"]')
                              .click();
                          }}
                        >
                          Cover Image
                          <Input
                            type="file"
                            name="coverImage"
                            placeholder="Cover Image"
                            focusBorderColor="primary.100"
                            borderColor="bgColor.400"
                            display="none"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                          />
                        </Button>
                      </VStack>
                    </FormControl>
                  </>
                )}
              </HStack>
              <Button type="submit" mt={4} colorScheme="primary" w="full">
                Update Profile
              </Button>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateProfile;
