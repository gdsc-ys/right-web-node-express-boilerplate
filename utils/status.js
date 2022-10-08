//https://www.whatap.io/ko/blog/40/

//1XX : Information responses
export const Continue = 100;
export const SwitchingProtocol = 101;
export const Processing = 102;

//2XX : Successful responses
export const OK = 200;
export const Created = 201;
export const Accepted = 202;
export const NonAuthoritativeInformation = 203;
export const NoContent = 204;
export const ResetContent = 205;
export const PartialContent = 206;
export const MultiStatus = 207;
export const AlreadyReported = 208;
export const IMUsed = 226;

//3XX : Redirection messages
export const MultipleChoice = 300;
export const MovedPermanently = 301;
export const Found = 302;
export const SeeOther = 303;
export const NotModified = 304;
export const UseProxy = 305;
export const Unused = 306;
export const TemporaryRedirect = 307;
export const PermanentRedirect = 308;

//4XX : Client error responses
export const BadRequest = 400;
export const Unauthorized = 401;
export const PaymentRequired = 402;
export const Forbidden = 403;
export const NotFound = 404;
export const MethodNotAllowed = 405;
export const NotAcceptable = 406;
export const ProxyAuthenticationRequired = 407;
export const RequestTimeout = 408;
export const Conflict = 409;
export const Gone = 410;
export const LengthRequired = 411;
export const PreconditionFailed = 412;
export const PayloadTooLarge = 413;
export const URITooLong = 414;
export const UnsupportedMediaType = 415;
export const RequestedRangeNotSatisfiable = 416;
export const ExpectationFailed = 417;
export const Imateapot = 418;
export const MisdirectedRequest = 421;
export const UnprocessableEntity = 422;
export const Locked = 423;
export const FailedDependency = 424;
export const UpgradeRequired = 426;
export const PreconditionRequired = 428;
export const TooManyRequests = 429;
export const RequestHeaderFieldsTooLarge = 431;
export const UnavailableForLegalReasons = 451;

//5XX : Server error reponses
export const InternalServerError = 500;
export const NotImplemented = 501;
export const BadGateway = 502;
export const ServiceUnavailable = 503;
export const GatewayTimeout = 504;
export const HTTPVersionNotSupported = 505;
export const VariantAlsoNegotiates = 506;
export const InsufficientStorage = 507;
export const LoopDetected = 508;
export const NotExtended = 510;
export const NetworkAuthenticationRequired = 511;
