import { Dispatch } from "./program";


export class Services<Message> {
  private readonly dispatch: Dispatch<Message>;
  private readonly services: Array<Service<Message, any, any>>;

  constructor(dispatch: Dispatch<Message>) {
    this.dispatch = dispatch;
    this.services = [];
  }

  public handleRequests(requests: ReadonlyArray<Req<Message, any>>) {
    for (const request of requests) {
      const service = this.service(request.service);
      service.handleRequest(request.request);
    }
  }

  public updateSubscriptions(subscriptions: ReadonlyArray<Sub<Message, any>>) {
    // Ensure all services are setup
    for (const subscription of subscriptions) {
      this.service(subscription.service);
    }

    // For each service update their subscriptions
    for (const service of this.services) {
      service.updateSubscriptions(subscriptions.filter((subscription) =>
        subscription.service === service.constructor));
    }
  }

  private service<R, S>(Type: ServiceClass<Message, R, S>): Service<Message, R, S> {
    for (const s of this.services) {
      if (s.constructor === Type) {
        return s;
      }
    }

    const service = new Type(this.dispatch);
    this.services.push(service);
    return service;
  }
}


/** Types */

export interface Service<Message, ServiceReq, ServiceSub> {
  handleRequest(request: Req<Message, ServiceReq>): void;
  updateSubscriptions(subscriptions: ReadonlyArray<Sub<Message, ServiceSub>>): void;
}

export interface Req<Message = any, ServiceReq = any> {
  service: ServiceClass<Message, ServiceReq, any>;
  request: ServiceReq;
}

export interface Sub<Message = any, ServiceSub = any> {
  service: ServiceClass<Message, any, ServiceSub>;
  subscription: ServiceSub;
}

export interface ServiceClass<Message, ServiceReq, ServiceSub> {
  new(dispatch: Dispatch<Message>): Service<Message, ServiceReq, ServiceSub>;
}
