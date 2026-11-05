import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent, eventKeys, updateEvent } from "../../queries/events";
import { errorMessage } from "../../axios";
import FormControlInput from "../FormControlInput";
import FormError from "../ui/FormError";
import { fromLocalInput, toLocalInput } from "./format";

const TITLE_MAX = 120;
const LOCATION_MAX = 200;
const DESCRIPTION_MAX = 2000;

function initialState(event) {
  return {
    title: event?.title ?? "",
    startsAt: event ? toLocalInput(event.startsAt) : "",
    endsAt: event?.endsAt ? toLocalInput(event.endsAt) : "",
    location: event?.location ?? "",
    description: event?.description ?? "",
  };
}

function validate(form, original) {
  const errors = {};
  const title = form.title.trim();
  if (!title) errors.title = "Give the event a title.";
  else if (title.length > TITLE_MAX) errors.title = `Keep it under ${TITLE_MAX} characters.`;

  const start = form.startsAt ? new Date(form.startsAt) : null;
  const startChanged = !original || form.startsAt !== toLocalInput(original.startsAt);
  if (!start || Number.isNaN(start.getTime())) errors.startsAt = "Pick a start date and time.";
  else if (startChanged && start <= new Date()) errors.startsAt = "The start time must be in the future.";

  if (form.endsAt) {
    const end = new Date(form.endsAt);
    if (Number.isNaN(end.getTime())) errors.endsAt = "That end time isn't valid.";
    else if (start && end <= start) errors.endsAt = "The end must be after the start.";
  }
  if (form.location.trim().length > LOCATION_MAX) {
    errors.location = `Keep it under ${LOCATION_MAX} characters.`;
  }
  if (form.description.length > DESCRIPTION_MAX) {
    errors.description = `Keep it under ${DESCRIPTION_MAX} characters.`;
  }
  return errors;
}

// Create (groupId) or edit (event) an event in a modal. Mount it only while
// open so the form starts from the event every time.
function EventFormModal({ isOpen, onClose, groupId, event, onSaved }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => initialState(event));
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);
  const isEdit = Boolean(event);

  const errors = validate(form, event);
  const shown = submitted ? errors : {};
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? updateEvent({ eventId: event.eventId, event: payload }) : createEvent({ groupId, event: payload }),
    onSuccess: (saved) => {
      queryClient.invalidateQueries(eventKeys.all);
      toast({ title: isEdit ? "Event updated." : `“${saved.title}” scheduled.`, status: "success" });
      onSaved?.(saved);
      onClose();
    },
    onError: (error) => setServerError(errorMessage(error, "Couldn't save the event.")),
  });

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    if (Object.keys(errors).length) return;
    const payload = {
      title: form.title.trim(),
      location: form.location.trim() || null,
      description: form.description.trim() || null,
      endsAt: fromLocalInput(form.endsAt),
    };
    // On edit, only send startsAt when it changed (an event that has started
    // can still be edited).
    if (!isEdit || form.startsAt !== toLocalInput(event.startsAt)) {
      payload.startsAt = fromLocalInput(form.startsAt);
    }
    mutation.mutate(payload);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit} noValidate>
        <ModalHeader>{isEdit ? "Edit event" : "New event"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControlInput
              label="Title"
              name="title"
              autoComplete="off"
              placeholder="Saturday photo walk"
              value={form.title}
              onChange={set("title")}
              error={shown.title}
              isRequired
            />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <FormControlInput
                label="Starts"
                type="datetime-local"
                name="startsAt"
                value={form.startsAt}
                onChange={set("startsAt")}
                error={shown.startsAt}
                isRequired
              />
              <FormControlInput
                label="Ends"
                type="datetime-local"
                name="endsAt"
                value={form.endsAt}
                onChange={set("endsAt")}
                error={shown.endsAt}
                helper="Optional."
              />
            </SimpleGrid>
            <FormControlInput
              label="Location"
              name="location"
              placeholder="Where to meet"
              value={form.location}
              onChange={set("location")}
              error={shown.location}
              helper="Optional."
            />
            <FormControl isInvalid={Boolean(shown.description)}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={form.description}
                onChange={set("description")}
                rows={4}
                resize="vertical"
                placeholder="What should people know or bring?"
              />
              {shown.description ? (
                <FormErrorMessage>{shown.description}</FormErrorMessage>
              ) : (
                <FormHelperText display="flex" justifyContent="flex-end">
                  <Text
                    as="span"
                    textStyle="meta"
                    color={form.description.length > DESCRIPTION_MAX ? "danger" : "text-muted"}
                  >
                    {form.description.length}/{DESCRIPTION_MAX}
                  </Text>
                </FormHelperText>
              )}
            </FormControl>
            <FormError>{serverError}</FormError>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isLoading}>
            {isEdit ? "Save changes" : "Create event"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EventFormModal;
