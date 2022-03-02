import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ChatServiceClient as _hello_ChatServiceClient, ChatServiceDefinition as _hello_ChatServiceDefinition } from './hello/ChatService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  hello: {
    ChatService: SubtypeConstructor<typeof grpc.Client, _hello_ChatServiceClient> & { service: _hello_ChatServiceDefinition }
    Message: MessageTypeDefinition
  }
}

