export const validationMessages = (field: string) => {
    return {
      empty: `${field} cannot be empty`,
      required: `${field} is a required field`,
      invalidType: `Please, provide a value for ${field}`,
      integer: `${field} must be an integer`,
      positive: `${field} is not a valid value`,
    };
  };
  