export default (error, req, res, next) => {
  console.error("ERROR HNADLER TRIGGRED", "\x1b[31m", error);
  // * Processing the error
  const cause = error.cause;
  /**
   * If cause is persent then returning customized error otheriwise
   * returning generic error with 500 status code
   */
  if (cause) {
    const status = cause.status || 500;
    const message = error.message || "Something went wrong!";

    res.status(status).json({
      status: "failed",
      message,
      data: cause.details || error,
    });

    // * For future use
    switch (cause.indicator) {
      case "validation":
        // *
        break;
      case "db":
        //*
        break;
    }
  } else {
    return res.status(500).json({
      status: "falied",
      message: "Something went wrong!",
      data: {},
    });
  }
};
