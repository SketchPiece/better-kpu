import { useState } from "react";

interface RolesSelectOptions {
  defaultValue?: ("student" | "employee")[];
  onChange: (value: ("student" | "employee")[]) => void;
}

export function useRolesSelect({
  defaultValue = ["student", "employee"],
  onChange,
}: RolesSelectOptions) {
  const [studentValue, setStudentValue] = useState(
    defaultValue.includes("student"),
  );
  const [employeeValue, setEmployeeValue] = useState(
    defaultValue.includes("employee"),
  );

  return {
    studentValue,
    employeeValue,
    handleStudentChange: (value: boolean) => {
      if (!value && !employeeValue) return;
      const rolesValue: ("student" | "employee")[] = [];
      if (value) rolesValue.push("student");
      if (employeeValue) rolesValue.push("employee");
      onChange(rolesValue);
      setStudentValue(value);
    },
    handleEmployeeChange: (value: boolean) => {
      if (!value && !studentValue) return;
      const rolesValue: ("student" | "employee")[] = [];
      if (value) rolesValue.push("employee");
      if (studentValue) rolesValue.push("student");
      onChange(rolesValue);
      setEmployeeValue(value);
    },
  };
}
