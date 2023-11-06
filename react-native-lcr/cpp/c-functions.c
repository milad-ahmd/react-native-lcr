#include <string.h>
#include <jni.h>
#include <stdio.h>

const char * countString(const char * inputString, char * outputString);

JNIEXPORT jstring Java_com_idex_CModule_stringFromC(JNIEnv* env, jobject obj, jstring inputString) {
  char * input = (*env)->GetStringUTFChars(env, inputString, NULL);
  char *output = (char*)malloc(256 * sizeof(char));
  countString(input, output);
  return (*env)->NewStringUTF(env, output);
}

const char * countString(const char * inputString, char * outputString) {
  sprintf(outputString, "C sez: \"%s\" is %u characters long.", inputString, (unsigned)strlen(inputString));
}
