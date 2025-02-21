export const validateBlog = (title, body) => {
    const errors = {};
  
    if (!title || title.length < 5 || title.length > 50) {
      errors.title = 'Title must be between 5 and 50 characters';
    }
  
    if (!body || body.length < 100 || body.length > 3000) {
      errors.body = 'Body must be between 100 and 3000 characters';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };