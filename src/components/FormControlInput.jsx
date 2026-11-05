import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useId } from "react";

// Labelled input with an inline validation message.
function FormControlInput({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  autoComplete,
  isRequired = false,
  error,
  helper,
  inputRef,
  ...props
}) {
  const id = useId();
  return (
    <FormControl isRequired={isRequired} isInvalid={Boolean(error)} {...props}>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      <Input
        id={id}
        ref={inputRef}
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helper && <FormHelperText>{helper}</FormHelperText>
      )}
    </FormControl>
  );
}

export default FormControlInput;
