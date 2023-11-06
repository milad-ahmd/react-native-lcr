// #import "Lcr.h"

// @implementation Lcr
// RCT_EXPORT_MODULE()

// // Example method
// // See // https://reactnative.dev/docs/native-modules-ios
// RCT_EXPORT_METHOD(multiply:(double)a
//                   b:(double)b
//                   resolve:(RCTPromiseResolveBlock)resolve
//                   reject:(RCTPromiseRejectBlock)reject)
// {
//     NSNumber *result = @(lcr::multiply(a, b));

//     resolve(result);
// }


// @end

#import "Lcr.h"
#import <React/RCTLog.h>


@implementation Lcr

RCT_EXPORT_MODULE(Lcr)

RCT_EXPORT_METHOD(buildMessageFunc:(NSArray *)message
                  toNode:(int)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  char chars[500] = {};
  for(int i = 0; i < message.count; i++) {
    int value = [message[i] intValue];
    chars[i] = value;
  }

  LCP *lcp = new LCP();
  const char *send = (const char*)lcp->buildMessage(node, 255, 2, chars, message.count);
  long length = lcp->msgLen;
  NSData *data = [NSData dataWithBytes:send length:length];
  resolve([data base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength]);
}


@end
