//
//  LCP.h
//  Idex
//
//  Created by Ed Lafoy on 1/24/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifdef __cplusplus

class LCP {
public:
    unsigned char* buildMessage(unsigned char to, unsigned char host, unsigned char status, const char *msg,unsigned short len);
    unsigned long msgLen; // absolute message length

private:
    unsigned char message[500];
    void appendByte(unsigned char byte, unsigned char **LCPMsgPtrPtr, unsigned long *msgLen,unsigned short *crc);
    void updateCRC(unsigned short *crc, unsigned char byte);

};

#endif