"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<
    React.ElementRef<typeof RPNInput.default>,
    PhoneInputProps
  >(({ className, onChange, value, ...props }, ref) => {
    return (
      <RPNInput.default
        ref={ref}
        className={cn(
          "flex w-full overflow-hidden rounded-2xl bg-gray-100",
          className
        )}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value || undefined}
        onChange={(v) =>
          onChange?.(v || ("" as RPNInput.Value))
        }
        {...props}
      />
    );
  });

PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      "h-full min-h-0 flex-1 rounded-none border-0 border-l-0 bg-transparent px-3 py-0 text-sm text-gray-900 shadow-none",
      "placeholder:text-gray-400",
      "focus-visible:ring-0 focus-visible:ring-offset-0",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
    ref={ref}
  />
));

InputComponent.displayName = "InputComponent";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: {
    label: string;
    value: RPNInput.Country | undefined;
  }[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open);

        if (open) {
          setSearchValue("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "flex h-full shrink-0 items-center gap-1",
            "rounded-none border-0 bg-transparent px-3",
            "text-gray-900 shadow-none",
            "hover:bg-transparent hover:text-gray-900",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "focus:z-10"
          )}
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />

          <span className="text-sm font-medium text-gray-900">
            +{RPNInput.getCountryCallingCode(selectedCountry)}
          </span>

          <ChevronsUpDown
            className={cn(
              "size-3 text-gray-600",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[280px] bg-white p-0 border-gray-200 shadow-xl">
        <Command className="bg-white">
          <CommandInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder="Search country..."
            className="h-10 text-sm text-black"
          />

          <CommandList className="bg-white">
            <ScrollArea className="h-72 bg-white">
              <CommandEmpty className="py-2 text-center text-sm text-black">
                No country found.
              </CommandEmpty>

              <CommandGroup className="bg-white">
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps
  extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem
      className={cn(
        "cursor-pointer gap-2 py-2 transition-colors",
        "bg-white text-black",
        "aria-selected:bg-black aria-selected:text-white"
      )}
      onSelect={handleSelect}
    >
      <FlagComponent
        country={country}
        countryName={countryName}
      />

      <span className="flex-1 text-sm font-medium">
        {countryName}
      </span>

      <span
        className={cn(
          "text-xs text-black/60",
          "group-aria-selected:text-white/80"
        )}
      >
        +{RPNInput.getCountryCallingCode(country)}
      </span>

      <CheckIcon
        className={cn(
          "ml-auto size-4",
          country === selectedCountry
            ? "opacity-100"
            : "opacity-0"
        )}
      />
    </CommandItem>
  );
};

const FlagComponent = ({
  country,
  countryName,
}: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 shrink-0 overflow-hidden rounded-sm bg-transparent [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
