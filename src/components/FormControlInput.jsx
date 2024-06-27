import { FormControl, Input } from "@chakra-ui/react";

function FormControlInput({
  type,
  name,
  placeholder,
  value,
  onChange,
  autoComplete,
}) {
  return (
    <FormControl mt={4}>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        isRequired
        focusBorderColor="primary.100"
        borderColor="bgColor.400"
        value={value}
        onChange={onChange}
      />
    </FormControl>
  );
}

export default FormControlInput;
