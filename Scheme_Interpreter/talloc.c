#include <stdlib.h>
#include "value.h"
#include <assert.h>
#include <stdio.h>
#include <stdbool.h>
Value *acthead;

// Replacement for malloc that stores the pointers allocated. It should store
// the pointers in some kind of list; a linked list would do fine, but insert
// here whatever code you'll need to do so; don't call functions in the
// pre-existing linkedlist.h. Otherwise you'll end up with circular
// dependencies, since you're going to modify the linked list to use talloc.
void *talloc(size_t size) {
  //check if head initialized - section unnecessary? 
  //we can keep the original head just a null value and check
  //for that in free
  //allocate memory
  void *newMem = malloc(size);
  //store ptr in value
  Value *listItem = malloc(sizeof(Value));
  listItem->type = PTR_TYPE;
  listItem->p = newMem;
  //store value w/ptr in list 
  Value *newCons = malloc(sizeof(Value));
  newCons->type = CONS_TYPE;
  newCons->c.car = listItem;
  newCons->c.cdr = acthead;
  acthead = newCons;
  return newMem;
}

// Free all pointers allocated by talloc, as well as whatever memory you
// allocated in lists to hold those pointers.
void tfree() {
  assert(acthead != NULL);
  //error was here, this malloc not freed (removed malloc
  Value *cur;
  cur = acthead;
  //changed to just acthead from acthead->c.cdr
  while (acthead != NULL) {
    free(acthead->c.car->p);
    free(acthead->c.car);
    cur = acthead;
    acthead = acthead->c.cdr;
    free(cur);
  }
}

// Replacement for the C function "exit", that consists of two lines: it calls
// tfree before calling exit. It's useful to have later on; if an error happens,
// you can exit your program, and all memory is automatically cleaned up.
void texit(int status) {
tfree();
exit(status);
}

