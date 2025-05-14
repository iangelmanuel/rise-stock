export const loginFormDefaultValues = {
  email: "",
  password: ""
}

export const registerFormDefaultValues = {
  name: "",
  email: "",
  password: "",
  repeatPassword: ""
}

export const nameValidation = {
  required: "This field is required",
  minLength: {
    value: 3,
    message: "Name must be at least 3 characters long"
  },
  maxLength: {
    value: 32,
    message: "Name must be at most 32 characters long"
  }
}

export const emailValidation = {
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
}

export const passwordValidation = {
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
}

export const repeatPasswordValidation = {
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
