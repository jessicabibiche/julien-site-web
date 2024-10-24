import { StatusCodes } from "http-status-codes";

const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  const msg =
    err.message || "Une erreur s'est produite, veuillez réessayer plus tard";
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  if (err.code === 11000) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ msg: "L'adresse email existe déjà " });
  }

  res.status(statusCode).json({ msg });
};

export default errorHandler;
