import { Req, Sub } from "@futura/core";

import { Time } from "./service";
import { AfterReq, AfterReqMessage } from "./service";
import { EverySub, EverySubMessage } from "./service";


/** Send the message after a specified duration in milliseconds */
export const after = <M, Args extends any[]>(time: number, Message: AfterReqMessage<M, Args>, ...params: Args): Req<M, AfterReq<Args>> =>
  ({
    service: Time,
    request: { type: "after", time, Message, params },
  });


/** Send the message every N milliseconds */
export const every = <M, Args extends any[]>(time: number, Message: EverySubMessage<M, Args>, ...params: Args): Sub<M, EverySub<Args>> =>
  ({
    service: Time,
    subscription: { type: "every", time, Message, params },
  });
