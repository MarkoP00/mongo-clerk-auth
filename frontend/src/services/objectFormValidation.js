export default function objectFormValidation(formData) {
  let formIsValid = true;

  const validationRules = {
    username: (value) => {
      if (!value) return "Missing Value";
      if (!/^[A-Za-z0-9]+$/.test(value) || value.length > 15)
        return "Invalid username";
      return null;
    },

    email: (value) => {
      if (!value) return "Missing Value!";
      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
      )
        return "Invalid email";
      return null;
    },
    password: (value) => {
      if (!value) return "Missing Value!";
      if (value.length <= 5) return "Password too short";
      if (!isStrongPassword(value)) return "Password too weak";
      return null;
    },
  };

  Object.keys(formData).forEach((key) => {
    const input = formData[key];
    const value = input.value.trim();

    //reset
    input.invalid = false;
    input.message = "";

    if (validationRules[key]) {
      const error = validationRules[key](value);

      if (error) {
        formIsValid = false;
        input.invalid = true;
        input.message = error;
      }
    }
  });

  return formIsValid;
}

function isStrongPassword(password) {
  return (
    /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
  );
}
