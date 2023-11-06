// #ifdef __cplusplus
// #import "react-native-lcr.h"
// #endif

// #ifdef RCT_NEW_ARCH_ENABLED
// #import "RNLcrSpec.h"

// @interface Lcr : NSObject <NativeLcrSpec>
// #else
// #import <React/RCTBridgeModule.h>

// @interface Lcr : NSObject <RCTBridgeModule>
// #endif

// @end


#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface Lcr : NSObject <RCTBridgeModule>
#endif

@end
