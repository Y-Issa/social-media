import {
  Box,
  Button,
  Checkbox,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuImage } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile, uploadImage } from "../../queries/profile";
import { errorMessage } from "../../axios";
import FormControlInput from "../FormControlInput";
import FormError from "../ui/FormError";

function useObjectUrl(file) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!(file instanceof File)) return setUrl(null);
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url;
}

function FilePicker({ label, file, onChange, ratio }) {
  const inputRef = useRef(null);
  const preview = useObjectUrl(file);
  return (
    <Box>
      <Text fontSize="13px" fontWeight={500} color="text-secondary" mb={1.5}>
        {label}
      </Text>
      <Flex align="center" gap={3}>
        <Box
          w={ratio === "cover" ? "96px" : "40px"}
          h="40px"
          flex="none"
          borderRadius={ratio === "cover" ? "sm" : "full"}
          border="1px solid"
          borderColor="border"
          bg="surface-raised"
          overflow="hidden"
        >
          {preview && <Image src={preview} alt="" w="full" h="full" objectFit="cover" />}
        </Box>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<LuImage size={16} />}
          onClick={() => inputRef.current?.click()}
        >
          {file instanceof File ? "Replace" : "Choose file"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </Flex>
    </Box>
  );
}

function initialForm(user) {
  return {
    name: user.name || "",
    city: user.city || "",
    website: user.website || "",
    profileImage: user.profileImage || "",
    coverImage: user.coverImage || "",
    newPassword: "",
    oldPassword: "",
  };
}

// "Edit profile" button + modal.
function UpdateProfile({ buttonProps }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(() => initialForm(user));
  const [isUpload, setIsUpload] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e?.target ? e.target.value : e }));

  function open() {
    setForm(initialForm(user));
    setIsUpload(false);
    setSubmitted(false);
    setServerError(null);
    onOpen();
  }

  const errors = {
    name: form.name.trim() ? null : "Enter your name.",
    oldPassword: form.oldPassword ? null : "Enter your current password to save.",
    newPassword:
      form.newPassword && form.newPassword.length < 6
        ? "Use at least 6 characters."
        : null,
  };

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      updateUser({ ...user, ...updatedUser });
      queryClient.invalidateQueries(["user"]);
      // Name/avatar appear on posts and comments too.
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["GroupPosts"]);
      queryClient.invalidateQueries(["comments"]);
      onClose();
      toast({ title: "Profile updated.", status: "success" });
    },
    onError: (error) => setServerError(errorMessage(error)),
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    if (Object.values(errors).some(Boolean)) return;

    let { coverImage, profileImage } = form;
    if (isUpload) {
      setIsUploading(true);
      try {
        if (coverImage instanceof File) coverImage = await uploadImage(coverImage);
        if (profileImage instanceof File) profileImage = await uploadImage(profileImage);
      } catch (error) {
        setServerError(errorMessage(error, "Could not upload the image."));
        return;
      } finally {
        setIsUploading(false);
      }
    }
    // Switching to upload without picking a file keeps the current image.
    if (!(typeof coverImage === "string")) coverImage = user.coverImage || "";
    if (!(typeof profileImage === "string")) profileImage = user.profileImage || "";

    mutation.mutate({
      name: form.name.trim(),
      city: form.city,
      website: form.website,
      newPassword: form.newPassword,
      oldPassword: form.oldPassword,
      coverImage,
      profileImage,
    });
  }

  const show = (field) => submitted && errors[field];

  return (
    <>
      <Button variant="secondary" onClick={open} {...buttonProps}>
        Edit profile
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit} noValidate>
          <ModalHeader>Edit profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControlInput
                label="Name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={set("name")}
                error={show("name")}
                isRequired
              />
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <FormControlInput
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={set("city")}
                />
                <FormControlInput
                  label="Website"
                  name="website"
                  autoComplete="url"
                  placeholder="example.com"
                  value={form.website}
                  onChange={set("website")}
                />
              </SimpleGrid>

              <Box pt={2}>
                <Flex justify="space-between" align="center" mb={3}>
                  <Text textStyle="label">Images</Text>
                  <Checkbox
                    colorScheme="primary"
                    size="sm"
                    isChecked={isUpload}
                    onChange={(e) => setIsUpload(e.target.checked)}
                  >
                    Upload files
                  </Checkbox>
                </Flex>
                {isUpload ? (
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    <FilePicker label="Profile photo" file={form.profileImage} onChange={set("profileImage")} />
                    <FilePicker label="Cover image" ratio="cover" file={form.coverImage} onChange={set("coverImage")} />
                  </SimpleGrid>
                ) : (
                  <Stack spacing={4}>
                    <FormControlInput
                      label="Profile photo URL"
                      name="profileImage"
                      placeholder="https://"
                      value={typeof form.profileImage === "string" ? form.profileImage : ""}
                      onChange={set("profileImage")}
                    />
                    <FormControlInput
                      label="Cover image URL"
                      name="coverImage"
                      placeholder="https://"
                      value={typeof form.coverImage === "string" ? form.coverImage : ""}
                      onChange={set("coverImage")}
                    />
                  </Stack>
                )}
              </Box>

              <Box pt={2}>
                <Text textStyle="label" mb={3}>
                  Password
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <FormControlInput
                    label="New password"
                    type="password"
                    name="newPassword"
                    autoComplete="new-password"
                    helper="Leave empty to keep it."
                    value={form.newPassword}
                    onChange={set("newPassword")}
                    error={show("newPassword")}
                  />
                  <FormControlInput
                    label="Current password"
                    type="password"
                    name="oldPassword"
                    autoComplete="current-password"
                    helper="Needed to save changes."
                    value={form.oldPassword}
                    onChange={set("oldPassword")}
                    error={show("oldPassword")}
                    isRequired
                  />
                </SimpleGrid>
              </Box>
              <FormError>{serverError}</FormError>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={mutation.isLoading || isUploading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateProfile;
