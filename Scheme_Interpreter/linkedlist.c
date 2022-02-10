#include <stdbool.h>
#include "value.h"
#include <stdlib.h>
#include <stdio.h>
#include "linkedlist.h"
#include <assert.h>
#include <string.h>
#include "talloc.h"
//initialize null Value
Value *makeNull(){
  Value *val = talloc(sizeof(Value));
  val->type = NULL_TYPE;
  return val;
}

// Create a new CONS_TYPE value node.
//requires new car and cdr value structs
Value *cons(Value *newCar, Value *newCdr) {
  Value *val = talloc(sizeof(Value));
  val->type = CONS_TYPE;
  //set car and cdr
  val->c.car = newCar;
  val->c.cdr = newCdr;
  return val;
}

// Display the contents of the linked list to the screen in some kind of
// readable format
void display(Value *list){
  assert(list != NULL);
  printf("List: [");
  bool endList = false;
  //car is null, usually reached the value from makenull()
  if (list->c.car->type == NULL_TYPE) {
    endList = true;
    printf("]");
  }
  //add OPEN_TYPE, CLOSE_TYPE, BOOL_TYPE, SYMBOL_TYPE
    //OPENBRACKET_TYPE, CLOSEBRACKET_TYPE, DOT_TYPE, SINGLEQUOTE_TYPE
  while (endList == false) {
    switch (list->c.car->type) {
      case INT_TYPE:
          printf("%i", (car(list)->i));
          break;
      case DOUBLE_TYPE:
          printf("%lf", (car(list)->d));
          break;
      case STR_TYPE:
          printf("%s", (car(list)->s));
          break;
      case CONS_TYPE:
          break;
      case NULL_TYPE:
          break;
      case VOID_TYPE:
          break;
      case PTR_TYPE:
          break;
      case OPEN_TYPE:
        break;
      case CLOSE_TYPE:
        break;
      case BOOL_TYPE:
        break;
      case SYMBOL_TYPE:
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
      printf("]\n");
    //more items left
    }else{
      printf(", ");
      //moved inside else
      list = cdr(list);
    }
    
  }
}

// Return a new list that is the reverse of the one that is passed in. All
// content within the list should be duplicated; there should be no shared
// memory whatsoever between the original list and the new one.
//
// FAQ: What if there are nested lists inside that list?
// ANS: There won't be for this assignment. There will be later, but that will
// be after we've got an easier way of managing memory.
Value *reverse(Value *list){
  assert(list != NULL);
  //initialize null value for end of list
  Value *revList = makeNull();
  Value *next;
  Value *last;
  int len = length(list);
  // loop over length of original
  for (int i = 0; i < len; i++) {
    next = cdr(list);
    if (i==0) {
      list->c.cdr = revList;
    }
    else{ 
      list->c.cdr = last;
    }
    last = list;
    revList = cons(car(list), revList);
    list = next;
  }
  return revList; 
}

// Utility to make it less typing to get car value. Use assertions to make sure
// that this is a legitimate operation.
// Make sure have <assert.h> in your #include statements in linkedlist.c in order
// to use assert (see assignment for more details).
Value *car(Value *list){
  assert(list != NULL);
  return list->c.car;
}

// Utility to make it less typing to get cdr value. Use assertions to make sure
// that this is a legitimate operation.
Value *cdr(Value *list) {
  assert(list != NULL);
  return list->c.cdr;
}
  
// Utility to check if pointing to a NULL_TYPE value. Use assertions to make sure
// that this is a legitimate operation.
bool isNull(Value *value) {
  assert(value !=NULL);
  if (value->type == NULL_TYPE) {
    return true;
  }
  return false;
}

// Measure length of list. Use assertions to make sure that this is a legitimate
// operation.
int length(Value *value) {
  bool endOfList = false;
  int counter = 0;
  assert(value !=NULL);
  //need to handle emptylist
  if (value->type == NULL_TYPE) {
    return 0;
  }
  while(endOfList == false){
    if(value->c.cdr->type == NULL_TYPE){
      counter = counter + 1;
      endOfList = true;
      return counter;
    }
    counter = counter + 1;
    value = value->c.cdr;
  }
  return counter;
}

