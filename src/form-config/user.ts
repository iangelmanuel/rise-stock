export const profileFormData = [
  {
    id: 1,
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Ej. Angel Manuel"
  },
  {
    id: 2,
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Ej. angel@example.com"
  }
] as const

export const profileUpdatePasswordFormData = [
  {
    id: 1,
    name: "oldPassword",
    label: "Old Password",
    type: "password",
    placeholder: "Ej. ********"
  },
  {
    id: 2,
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Ej. ********"
  },
  {
    id: 3,
    name: "repeatPassword",
    label: "Repeat Password",
    type: "password",
    placeholder: "Ej. ********"
  }
] as const

export const userValidation = {
  name: {
    required: "This field is required",
    minLength: {
      value: 3,
      message: "Name must be at least 3 characters long"
    },
    maxLength: {
      value: 32,
      message: "Name must be at most 32 characters long"
    }
  },
  email: {
    required: "This field is required",
    minLength: {
      value: 3,
      message: "Email must be at least 3 characters long"
    },
    maxLength: {
      value: 32,
      message: "Email must be at most 32 characters long"
    },
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Email must be a valid email address"
    }
  },
  password: {
    required: "This field is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long"
    },
    maxLength: {
      value: 32,
      message: "Password must be at most 32 characters long"
    },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }
  },
  repeatPassword: {
    required: "This field is required",
    minLength: {
      value: 8,
      message: "Repeat password must be at least 8 characters long"
    },
    maxLength: {
      value: 32,
      message: "Repeat password must be at most 32 characters long"
    },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message:
        "Repeat password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }
  }
}
