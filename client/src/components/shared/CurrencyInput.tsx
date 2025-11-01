"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

type CurrencyInputProps = {
  value: number | { target_value: number };
  setValue: (value: number | { target_value: number }) => void;
  handleInputChanged?: (
    e: { value: number } & React.ChangeEvent<HTMLInputElement>
  ) => void;
  valueErrors?: boolean;
  idInput?: string;
  isDisable?: boolean;
};

export default function CurrencyInput({
  value,
  setValue,
  handleInputChanged,
  valueErrors,
  idInput,
  isDisable,
}: Readonly<CurrencyInputProps>) {
  const numericValue = typeof value === "object" ? value?.target_value : value;

  const [rawValue, setRawValue] = useState(
    numericValue !== undefined
      ? String(Math.round(numericValue * 100)).replace(/\D/g, "")
      : ""
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const formattedValue =
    rawValue === ""
      ? "0,00"
      : (Number(rawValue) / 100).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length > 16) {
      digitsOnly = digitsOnly.slice(0, 16);
    }
    setRawValue(digitsOnly);

    const parsedValue = digitsOnly ? parseFloat(digitsOnly) / 100 : 0;

    if (typeof value === "object") {
      setValue({
        ...value,
        target_value: parsedValue,
      });
    } else {
      setValue(parsedValue);
    }

    if (handleInputChanged) {
      handleInputChanged({
        ...e,
        value: parsedValue,
      });
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [formattedValue]);

  useEffect(() => {
    const currentNumericValue =
      typeof value === "object" ? value?.target_value : value;
    if (currentNumericValue !== undefined) {
      const newRaw = currentNumericValue
        ? String(Math.round(currentNumericValue * 100))
        : "";
      setRawValue(newRaw);
    }
  }, [numericValue, value]);

  return (
    <Input
      type="text"
      id={idInput}
      name="target-value"
      ref={inputRef}
      value={`R$ ${formattedValue}`}
      onChange={handleChange}
      placeholder="R$ 0,00"
      className={
        valueErrors
          ? "p-invalid"
          : "border-slate-300 focus:border-blue-650 focus:ring-blue-650  rounded-md w-full"
      }
      disabled={isDisable}
    />
  );
}
