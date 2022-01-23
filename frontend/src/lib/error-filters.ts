import BirdybopError from "@/lib/BirdybopError";

const errorFilterer = (filter: (error: Error) => boolean): ((error: Error) => void) => (error) => {
  if (!filter(error)) throw error;
};

export const isNavDuplicatedError = (error: Error): boolean => {
  return error.name === "NavigationDuplicated"
    && error.message.includes("redundant navigation to current location");
};

export const filterNavDuplicated = errorFilterer(isNavDuplicatedError);

export const catchHttpCode = (code: number, handler?: (error: BirdybopError) => void): ((error: Error) => void) => (error) => {
  const birdybopError = BirdybopError.from(error);
  if (birdybopError.httpStatus !== code) throw error;
  if (handler) return handler(birdybopError);
};
