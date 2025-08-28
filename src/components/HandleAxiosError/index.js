// Ya fu/nction har trah ka backend ka errors ko show karwa dey ga

const handleAxiosError = (error) => {
  let message = "Server error";
  let status = null;

  // Missing dependency
  if (error instanceof ReferenceError) {
    message = `Missing dependency: ${error.message}`;
  } else if (error.response?.data) {
    const data = error.response.data;
    status = error.response.status;

    // ✅ check nested "data.message"
    if (data.message) {
      message = data.message;
    } else if (data.data?.message) {
      message = data.data.message;
    } else if (data.errors) {
      message =
        typeof data.errors === "string"
          ? data.errors
          : JSON.stringify(data.errors);
    } else {
      message = JSON.stringify(data);
    }
  } else if (error.request) {
    message = "No response from server. Please try again later.";
  } else if (error.message) {
    message = error.message;
  }

  return { message, status };
};

export default handleAxiosError;
