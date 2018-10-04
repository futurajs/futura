import { Req } from "@futura/core";

import { AfterReq, AfterReqMessage, Time } from "./service";


/** Send the message after a specified duration in milliseconds */
export const after = <M>(time: number, Message: AfterReqMessage<M>, ...params: any[]): Req<M, AfterReq> =>
  ({
    service: Time,
    request: { type: "after", time, Message, params },
  });
