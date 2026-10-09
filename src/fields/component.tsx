import * as React from "react";
import { SelectInput, useField } from "payload/components/forms";
import { useAuth } from "payload/components/utilities";
import axios from "axios";

export const CustomHasManySelectComponent: React.FC<{ path: string }> = ({
  path,
}) => {
  const { user, token } = useAuth();
  const { value, setValue } = useField<string>({ path });
  const [options, setOptions] = React.useState([]);

  // Fetch options on component mount
  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "https://payment-router-gateway.ng2fqynrn8.workers.dev/api/list-method?code="
        );
        const data = await response.json();

        console.log(data);

        const paymentOptions = data.data.map((payment) => {
          return {
            label: `${payment.label + " " + payment.image}`,
            value: payment.id,
          };
        });

        console.log(paymentOptions);

        setOptions(
          paymentOptions.sort((a, b) => a.label.localeCompare(b.label))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchOptions();
  }, []);

  React.useEffect(() => {
    if (value && !Array.isArray(value)) {
      // convert saved stringified array back to an array
      const newValue = JSON.parse(value);
      setValue(newValue);
    }
  }, [value]);

  return (
    <div>
      <label className="field-label">Select payment method</label>
      <SelectInput
        path={path}
        name={path}
        hasMany={true}
        options={options}
        value={value}
        onChange={(selectedOption) => {
          if (!Array.isArray(selectedOption)) return;
          const newValue = selectedOption.map((option) => option.value);
          setValue(newValue);
        }}
      />
    </div>
  );
};

function useCallback(
  arg0: (selectedOption: any) => void,
  arg1: ((val: unknown, modifyForm?: boolean) => void)[]
) {
  throw new Error("Function not implemented.");
}
