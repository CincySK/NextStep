import React, { createContext, useContext, useMemo } from "react";
import { cn } from "./utils";
import { Label } from "./Label";

const FormContext = createContext({
  values: {},
  errors: {},
  setValue: () => {}
});

const FormFieldContext = createContext({
  name: ""
});

const FormItemContext = createContext({
  id: ""
});

function Form({ children, values = {}, errors = {}, setValue = () => {} }) {
  const contextValue = useMemo(
    () => ({ values, errors, setValue }),
    [values, errors, setValue]
  );
  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

function FormField({ name, render, children, ...props }) {
  const { values, setValue } = useContext(FormContext);
  const field = {
    name,
    value: values?.[name] ?? "",
    onChange: (eventOrValue) => {
      const nextValue = eventOrValue?.target ? eventOrValue.target.value : eventOrValue;
      setValue(name, nextValue);
    }
  };

  return (
    <FormFieldContext.Provider value={{ name }}>
      {typeof render === "function" ? render({ field, ...props }) : children}
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const formContext = useContext(FormContext);

  const fieldName = fieldContext?.name;
  const error = fieldName ? formContext?.errors?.[fieldName] : undefined;
  const id = itemContext?.id;

  return {
    id,
    name: fieldName,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    error
  };
}

function FormItem({ className, ...props }) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("ui-form-item", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }) {
  const { error, formItemId } = useFormField();
  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("ui-form-label", error && "ui-form-label-error", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ children, ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    });
  }
  return null;
}

function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useFormField();
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("ui-form-description", className)}
      {...props}
    />
  );
}

function FormMessage({ className, children, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? error ?? "") : children;
  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("ui-form-message", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField
};
