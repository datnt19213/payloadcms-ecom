import {createHmac} from "crypto";
import {Enum} from "../../common/data";

export const generateHashCode = (data: string): string => {
  const hmac = createHmac("sha256", Enum.secretKey.toString());
  hmac.update(data);
  return hmac.digest("hex");
};
