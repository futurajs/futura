import { Dispatch, Service } from "@futura/core";


export class Time implements Service<TimeReq, TimeSub> {
  private readonly dispatch: Dispatch<any>;

  constructor(dispatch: Dispatch<any>) {
    this.dispatch = dispatch;
  }

  public handleRequest(cmd: TimeReq) {
    switch (cmd.type) {
      case "after":
        setTimeout(() => this.dispatch(new cmd.Message(...cmd.params)), cmd.time);
        break;
    }
  }

  public updateSubscriptions(_subs: ReadonlyArray<TimeSub>) {
    return;
  }
}

type TimeReq = AfterReq;
type TimeSub = never;

export interface AfterReq {
  type: "after";
  time: number;
  Message: AfterReqMessage<any>;
  params: any[];
}

export interface AfterReqMessage<Message> {
  new(...params: any[]): Message;
}
