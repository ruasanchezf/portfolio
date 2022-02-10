#include "value.h"
#include <stdio.h>
#include "linkedlist.h"
#include <string.h>
// Takes a list of tokens from a Racket program, and returns a pointer to a
// parse tree representing that program.
Value *parse(Value *tokens){
  Value *parseStack = makeNull();
  Value *tempList;
  int close = 0;
  int open = 0;
  int cut = 0;
  //first item not OPEN_TYPE, add to stack plain
  if (tokens->type != NULL_TYPE && tokens->c.car->type != OPEN_TYPE) {
    parseStack= cons(tokens->c.car,parseStack);
    tokens = cdr(tokens);
    if (tokens->type != NULL_TYPE){
      parseStack = cons(parse(tokens)->c.car,parseStack);
    }
  }
  
  else {
    //handle every token
    while (tokens->type != NULL_TYPE) {
       //add tokens to parseStack until CLOSE_TYPE
       while (tokens->type != NULL_TYPE && tokens->c.car->type != CLOSE_TYPE) {
          if (tokens->c.car->type == OPEN_TYPE) {
            open++;
          }
          parseStack = cons(tokens->c.car, parseStack);
          tokens = cdr(tokens);
      }
      //nothing between parentheses
      if (tokens->type != NULL_TYPE && tokens->c.car->type == CLOSE_TYPE && parseStack->c.car->type == OPEN_TYPE) {
        parseStack = cons(tokens->c.car, parseStack);
        cut = 1;
      }
      if (tokens->type == NULL_TYPE){
        printf("Syntax error");
        return makeNull();
      } else if (tokens->c.car->type == CLOSE_TYPE) {
        close++;}
      //parseStack now in reverse order, open parens at far end
      tempList = makeNull();
      //go until first open and push all to list
      while (parseStack->type != NULL_TYPE && parseStack->c.car->type != OPEN_TYPE) {
        tempList = cons(parseStack->c.car, tempList);  
        parseStack = cdr(parseStack);
       }
       if (parseStack->type != NULL_TYPE && parseStack->c.car->type == OPEN_TYPE) {
         parseStack = cdr(parseStack);
       }
      //add list back to stack
      parseStack = cons(tempList,parseStack);
      tokens = cdr(tokens);
    }
  }
    //printf("%i %i", close, open);
    if (open == close) {
      if (cut ==0) {return reverse(parseStack);}
      else {return reverse(parseStack);}
    }
    else {
      printf("Syntax error, check parentheses");
      return makeNull();
    }
}

// Prints the tree to the screen in a readable fashion. It should look just like
// Racket code; use parentheses to indicate subtrees.
void printTree(Value *tree){
  //leaf
  if (tree->type == NULL_TYPE) {
    printf("()");
  }
  while (tree->type != NULL_TYPE) {
    switch (tree->c.car->type) {
      case INT_TYPE:
          printf("%i", (car(tree)->i));
          break;
      case DOUBLE_TYPE:
          printf("%lf", (car(tree)->d));
          break;
      case STR_TYPE:
          printf("\"%s", (car(tree)->s));
          printf("\"");
          break;
      case VOID_TYPE:
          break;
      case CONS_TYPE:
          //descend into sub-tree (with dumb fix for parens error)
          printf("(");
          printTree(tree->c.car);
          printf(")");
      case NULL_TYPE:
          break;
      case PTR_TYPE:
          printf("%p\n", (car(tree)->p));
          break;
      case OPEN_TYPE:
          break;
      case CLOSE_TYPE:
          break;
      case BOOL_TYPE:
          if (car(tree)->i == 0) {
            printf("#f");
          }
          else {
            printf("#t");
          }
          break;
      case SYMBOL_TYPE:
          printf("%s", (car(tree)->s));
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
    //inserting spaces here - unless next is a close parentheses
    if (tree->type == CONS_TYPE && tree->c.cdr->type != NULL_TYPE && tree->c.cdr->type == CONS_TYPE && tree->c.cdr->c.car->type != CLOSE_TYPE) {
        printf(" ");
    }
    tree = cdr(tree);
  }
}