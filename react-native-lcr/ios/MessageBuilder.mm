//
//  MessageBuilder.mm
//  Idex
//
//  Created by Ed Lafoy on 1/24/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

// #import "MessageBuilder.h"
// #import "LCP.hpp"
// #import <React/RCTLog.h>


// @implementation Lcr

// RCT_EXPORT_MODULE(Lcr)

// RCT_EXPORT_METHOD(buildMessageFunc:(NSArray *)message
//                   toNode:(int)node
//                   resolver:(RCTPromiseResolveBlock)resolve
//                   rejecter:(RCTPromiseRejectBlock)reject) {
//   char chars[500] = {};
//   for(int i = 0; i < message.count; i++) {
//     int value = [message[i] intValue];
//     chars[i] = value;
//   }

//   LCP *lcp = new LCP();
//   const char *send = (const char*)lcp->buildMessage(node, 255, 2, chars, message.count);
//   long length = lcp->msgLen;
//   NSData *data = [NSData dataWithBytes:send length:length];
//   resolve([data base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength]);
// }


// @end
