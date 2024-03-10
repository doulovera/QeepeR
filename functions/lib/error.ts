export default class ApplicationError extends Error {
  public readonly statusCode: number;

  constructor(
    readonly name: string,
    readonly message: string,
    statusCode: number = 500,
  ) {
    super(message);
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
  }
}
