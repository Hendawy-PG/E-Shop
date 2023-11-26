function UnimplementedError(methodName = "") {
  throw Error("Not Implemented " + methodName);
}

export default UnimplementedError;
