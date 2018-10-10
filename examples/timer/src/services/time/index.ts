import { Req } from "@futura/core";

import { AfterReq, AfterReqMessage, Time } from "./service";


/** Send the message after a specified duration in milliseconds */
export const after = <M, Args extends any[]>(time: number, Message: AfterReqMessage<M, Args>, ...params: Args): Req<M, AfterReq<Args>> =>
  ({
    service: Time,
    request: { type: "after", time, Message, params },
  });
