// #include "react-native-lcr.h"

// namespace lcr {
// 	double multiply(double a, double b) {
// 		return a * b;
// 	}
// }

//
//  LCP.m
//  Idex
//
//  Created by Ed Lafoy on 1/24/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

// #import "LCP.hpp"
#include "react-native-lcr.hpp"

unsigned char LCP_StatusReply = 0;
unsigned char LCP_StatusPlusPlus = 1;

unsigned short EscapeChar = { 0x1B };
unsigned short NullChar = 0x0;

unsigned char* LCP::buildMessage(unsigned char to, unsigned char host, unsigned char status, const char *msg, unsigned short len) {
  // Local variables.
  unsigned char *LCPtxMsgPtr; // pointer to the LCP transmit message buffer
  unsigned short crc; // CRC of message
  unsigned short i; // loop variable

  // Build the LCP message header.
  LCPtxMsgPtr = &message[0]; // initialize pointer to the LCP transmit buffer
  *LCPtxMsgPtr++ = '~'; // insert the first ~
  *LCPtxMsgPtr++ = '~'; // insert the second ~
  msgLen = 2UL; // length of LCP message
  crc = 0x7E7E; // seed the CRC with the message header

  // Build the variable part of the message.
  appendByte(to,&LCPtxMsgPtr,&msgLen,&crc);
  appendByte(host,&LCPtxMsgPtr,&msgLen,&crc);

  if (len > 0xFF && (status & LCP_StatusReply) == 0x00)
    status |= LCP_StatusPlusPlus; // send an LCP++ message

  appendByte(status,&LCPtxMsgPtr,&msgLen,&crc);
  appendByte((unsigned char)(len%0x0100),&LCPtxMsgPtr,&msgLen,&crc);

  if (status & LCP_StatusPlusPlus) // check for LCP++ message
    appendByte((unsigned char)(len/0x0100),&LCPtxMsgPtr,&msgLen,&crc);

  for (i=0; i < len; i++) // loop to include the message
    appendByte(msg[i],&LCPtxMsgPtr,&msgLen,&crc);

  appendByte((unsigned char)(crc%0x0100),&LCPtxMsgPtr,&msgLen,&NullChar);
  appendByte((char)(crc/0x0100),&LCPtxMsgPtr,&msgLen,&NullChar);
  // LCPBuildMessage exit point.
  return message;
}


void LCP::appendByte(unsigned char byte, unsigned char **LCPMsgPtrPtr, unsigned long *msgLen,unsigned short *crc) {
  // Check for special characters.
  if (byte == EscapeChar || byte == '~') { // check for special characters
    *((*LCPMsgPtrPtr)++) = EscapeChar; // insert the <esc> character
    (*msgLen)++; // update the LCP message length
    updateCRC(crc,EscapeChar); // include the <esc> in the CRC
  }

  // Append the byte to the end of the message.
  *((*LCPMsgPtrPtr)++) = byte; // insert the new byte
  (*msgLen)++; // update the LCP message length
  updateCRC(crc,byte); // include the byte in the CRC
}

void LCP::updateCRC(unsigned short *crc, unsigned char byte) {
  char XORFlag;
  // Combine the new data byte with the current CRC.
  if (crc != &NullChar) {
    for (int i=7; i >= 0; --i) {
      XORFlag = (unsigned char)((*crc & 0x8000) != 0x0000);
      *crc <<= 1; // shift the CRC left
      *crc |= (unsigned short)((byte >> i) & 0x01);
      if (XORFlag) // check for CRC overflow
        *crc ^= 0x1021; // XOR with polynomial
    }
  }
}

