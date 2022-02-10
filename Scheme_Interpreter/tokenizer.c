#include "value.h"
#include <stdio.h>
#include "linkedlist.h"
#include "talloc.h"
#include <stdbool.h>
#include <stdlib.h>
#include <assert.h>

bool contLoop;

bool isInitial(char c){
  bool result = false;
  if ('`' < c && c < '{') {
    result = true;
  }
  if ('@' < c && c < '[') {
    result = true;
  }
  int symbolArr[14] = {'!','$','%','&','*','/',':','<','=','>','?','^','_','~'};
  
  for (int i = 0; i < 14; i++) {
    if (symbolArr[i] == c) {
      result = true;
    }
  }
  return result;
}

bool isSub(char c) {
  bool result = false;
  result = isInitial(c);
  if (result == false && ((47 < c && c < 58) || c == '.' || c == '+' || c == '-')) {
    result = true;
  }
  return result;
}


// Read all of the input from stdin, and return a linked list consisting of the
// tokens.
Value *tokenize() {
  char charRead;
  Value *list = makeNull();
  charRead = (char)fgetc(stdin);
  bool negNum = false;
  bool isDouble = false;
  contLoop = true;
  if (charRead == EOF) {
    contLoop = false;
  }
  while (charRead != EOF && contLoop == true) {
    //next item a comment
    if (charRead == ';') {
     while (charRead != 10) {
      charRead = (char)fgetc(stdin);
      }
      if (charRead == 10) {
        //do nothing
      }
    //might need to check for EOF
    }
      //next item a string
    else if (charRead =='"') {
      charRead = (char)fgetc(stdin);
      char *charString = (char*) talloc(sizeof(char)*301);
      int counter = 0;
      while (charRead != '"'){
        charString[counter] = charRead;
        counter = counter + 1;
        charRead = (char)fgetc(stdin);
      }
      //null terminate
      charString[counter] = '\0';
      Value *newVal = talloc(sizeof(Value));
      newVal->type = STR_TYPE;
      newVal->s = charString;
      list = cons(newVal, list);
    }else if (charRead == 64){
      printf("Syntax error: no at");
      contLoop = false;
    }
            
    //next item a number
    // - check valgrind/ string formatting
    else if ((charRead > '/' && charRead < ':') || charRead == '.' || charRead == '-' || charRead == '+'){
      //loop until space
      bool isNum = true;
      bool isPosNum = false;
      char *numString = (char*) talloc(sizeof(char)*301);
      
      int counter = 0;
      if (charRead == '-' || charRead == '+'){
        if (charRead == '+'){
          isPosNum = true;
        }
        charRead = (char)fgetc(stdin);
        if(charRead > '/' && charRead < ':'){
          negNum = true;
        }else{
          //subtraction symbol
          isNum = false;
          char *charString = (char*) talloc(sizeof(char)*2);
          if( isPosNum == true){
            charString[0] = '+';
          }else{
            charString[0] = '-';
          }
          charString[1] = '\0';
          Value *newVal = talloc(sizeof(Value));
          newVal->type = SYMBOL_TYPE;
          newVal->s = charString;
          list = cons(newVal, list);
          ungetc(charRead, stdin);
          //symbol
          }
        }
        if (isNum == true) {
        if(negNum == true){
              numString[counter] = 45;
              counter = counter + 1;
              negNum = false;
        }
      if (charRead == '.') {
        isDouble = true;
        numString[counter] = charRead;
        counter = counter + 1;
        charRead = (char)fgetc(stdin);
      }
      while ((charRead > '/' && charRead < ':') || (charRead == '.' && isDouble == false)) {
        if (charRead == '.') {
          isDouble = true;
        }
        numString[counter] = charRead;
        counter = counter + 1;
        charRead = (char)fgetc(stdin);
      }
      numString[counter] = '\0';
      Value *newVal = talloc(sizeof(Value));
      char *rand = talloc(sizeof(char));
      if (isDouble == true) {
        newVal->type = DOUBLE_TYPE;
        double newDouble;
        newDouble = strtod(numString, &rand);
        newVal->d = newDouble;
        isDouble = false;
      }
      else { //int
        int *newInt = talloc(sizeof(int));
        newVal->type = INT_TYPE;
        *newInt = atoi(numString);
        newVal->i = *newInt;
      }
      if (charRead == 41) {
        ungetc(charRead, stdin);
      }
      list = cons(newVal, list);
      }
    }

    //next item is a bool
    else if (charRead == '#') {
      charRead = (char)fgetc(stdin);
      Value *newVal = talloc(sizeof(Value));
      newVal->type = BOOL_TYPE;
      int newBool = 0;
      if(charRead == 't'){
        newBool = 1;
        newVal->i = newBool;
      }else if (charRead == 'f'){
        newVal->i = newBool;
      }else{
        printf("Syntax error: Failed in Boolean. ");
        contLoop = false;
      }
      list = cons(newVal, list);
      //move next?
    }

    //open or close
    else if (charRead == '(' || charRead == ')') {
      Value *newVal = talloc(sizeof(Value));
      if (charRead == '(') {
        newVal->type = OPEN_TYPE;
      }
      else {
        newVal->type = CLOSE_TYPE;
      }
      list = cons(newVal, list);
    }
    //CHECK 
    //symbols: letter, 33, 36,37,38,42,47,58,60,61,62,63,94,95,126
    else if (isInitial(charRead) == true ) {
      char *charString = (char*) talloc(sizeof(char)*301);
      int counter = 0;
      while (charRead > 31 && charRead != 32 && charRead != '@' && charRead != '+' && charRead != '{' && charRead != '(' && charRead != ')' && charRead != 10){
        charString[counter] = charRead;
        counter = counter + 1;
        charRead = (char)fgetc(stdin);
      }
      if (charRead == ')') {
        ungetc(charRead, stdin);
      }
      charString[counter] = '\0';
      Value *newVal = talloc(sizeof(Value));
      newVal->type = SYMBOL_TYPE;
      newVal->s = charString;
      list = cons(newVal, list);
    }else if (charRead == 32 || charRead == '\n'){
      //do nothing
    }else {//invalid character?
      printf("Syntax Error: invalid character.");   
      contLoop = false; 
    }
    charRead = (char)fgetc(stdin);
  }
  Value *revList = reverse(list);
  return revList;
}


// Displays the contents of the linked list as tokens, with type information
void displayTokens(Value *list) {
assert(list != NULL);
bool endList = false;
if (contLoop == false) {
  endList = true;
}
else if (list->c.car->type == NULL_TYPE) {
  endList = true;
}
  while (endList == false) {
    switch (list->c.car->type) {
      case INT_TYPE:
          printf("%i:integer\n", (car(list)->i));
          break;
      case VOID_TYPE:
          break;
      case DOUBLE_TYPE:
          printf("%lf:double\n", (car(list)->d));
          break;
      case STR_TYPE:
          printf("\"%s", (car(list)->s));
          printf("\":string\n");
          break;
      case CONS_TYPE:
          break;
      case NULL_TYPE:
          break;
      case PTR_TYPE:
          printf("%p : pointer\n", (car(list)->p));
          break;
      case OPEN_TYPE:
        printf("(:open\n");
        break;
      case CLOSE_TYPE:
        printf("):close\n");
        break;
      case BOOL_TYPE:
      if (car(list)->i == 0) {
        printf("#f:boolean\n");
      }
      else {
        printf("#t:boolean\n");
      }
      //printf("%i : boolean\n", (car(list)->i));
        break;
      case SYMBOL_TYPE:
        printf("%s:symbol\n", (car(list)->s));
        break; 
      case OPENBRACKET_TYPE:
        break;
      case CLOSEBRACKET_TYPE:
        break;
      case DOT_TYPE:
        break;
      case SINGLEQUOTE_TYPE:
        break; 
      }
    //last item, already printed value
    if (list->c.cdr->type == NULL_TYPE) {
      endList = true;
    }
      list = cdr(list);
  }
}
