export function validate(schema, source = "body") {
  return function validationMiddleware(req, res, next) {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({ message: "Datos inválidos", errors });
    }

    req[source] = result.data;
    next();
  };
}
