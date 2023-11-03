#include <jni.h>
#include "react-native-lcr.h"

extern "C"
JNIEXPORT jdouble JNICALL
Java_com_lcr_LcrModule_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return lcr::multiply(a, b);
}
