#include "value.h"
#include <stdlib.h>
#include <stdio.h>
#include "linkedlist.h"
#include <string.h>
#include "talloc.h"
#include "parser.h"
Value *eval(Value *expr, Frame *frame);
int isAtom(Value *result);

void bind(char *name, Value *(*function)(struct Value *), Frame *frame){
  Value *newSymbol = talloc(sizeof(Value));
  newSymbol->type = SYMBOL_TYPE;
  newSymbol->s = name;
  Value *newValue = talloc(sizeof(Value));
  newValue->type = PRIMITIVE_TYPE;
  newValue->primFn = function;
  Value *newBind = cons(newSymbol,newValue);
  frame->bindings = cons(newBind,frame->bindings);
}

void evaluationError() {
   printf("Evaluation error");
   texit(0);}

Frame *goToTop(Frame *curFrame) {
  Frame *result = curFrame;
  while (result->parent != NULL) {
    result = result->parent;}
  return result;
}

void printResult(Value *result) {
  switch (result->type)  {
     case INT_TYPE: {
        printf("%i", result->i);
        break;}
     case BOOL_TYPE: {
        if (result->i == 1) {
          printf("#t");
        }else{printf("#f");}
          break;}
     case SYMBOL_TYPE:
        printf("%s", result->s); 
        break;
     case CONS_TYPE: {
        printf("(");
        while (result->type != NULL_TYPE){
          if (cdr(result)->type !=  NULL_TYPE && isAtom(cdr(result)) ==1) {
            printResult(car(result));
            printf(" . ");
            printResult(cdr(result));
            break;
          }else {
            printResult(car(result));
            printf(" ");
          }
          result = cdr(result);
        }
        printf(")");
        break;}
     case DOUBLE_TYPE: {
       printf("%lf\n", result->d);
       break;}
     case STR_TYPE:{
       printf("\"%s\"", result->s);
       break;}
      case CLOSURE_TYPE:{
        printf("#<procedure>");
        break;}
    default:
       break;}
}

int isAtom(Value *result) {
  if (result == NULL || result->type == NULL_TYPE) {
    printf("This atom is NUll \n");
    evaluationError();}
  if (result->type ==  INT_TYPE || result->type ==  STR_TYPE || result->type ==  DOUBLE_TYPE || result->type == BOOL_TYPE ) {
    return 1;
  }
  return 0;
}

Value *evalMod(Value *args) {
  Value *arg1 = car(args);
  Value *arg2 = car(cdr(args));
  int term = arg1->i;
  int mod = arg2->i;
  while (term>=mod) {
    term = term-mod;
  }
  Value *result = talloc(sizeof(Value));
  result->type = INT_TYPE;
  result->i =term;
  return result;
}

Value *evalEquals(Value *args) {
  Value *result = talloc(sizeof(Value));
  result->type = BOOL_TYPE;
  result->i = 0;
  Value *scar = car(args);
  Value *scdr = car(cdr(args));
  int carDouble = 0;
  int cdrDouble = 0;
  if (car(args)->type == DOUBLE_TYPE) {
    carDouble = 1;
  } 
  if (car(cdr(args))->type == DOUBLE_TYPE) {
    cdrDouble = 1;
  }
  if (!cdrDouble && !carDouble) {
    if (scar->i == scdr->i) {
      result->i = 1;
    }
  }
  return result;
}

Value *evalLess(Value *args) {
  Value *result = talloc(sizeof(Value));
  result->type = BOOL_TYPE;
  result->i = 0;
  Value *scar = car(args);
  Value *scdr = car(cdr(args));
  int carDouble = 0;
  int cdrDouble = 0;
  if (car(args)->type == DOUBLE_TYPE) {
    carDouble = 1;
  } 
  if (car(cdr(args))->type == DOUBLE_TYPE) {
    cdrDouble = 1;
  }
  if (!cdrDouble && !carDouble) {
    if (scar->i < scdr->i) {
      result->i = 1;
    }
  }
  return result;
}
Value *evalGreater(Value *args) {
  Value *result = talloc(sizeof(Value));
  result->type = BOOL_TYPE;
  result->i = 0;
  Value *scar = car(args);
  Value *scdr = car(cdr(args));
  int carDouble = 0;
  int cdrDouble = 0;
  if (car(args)->type == DOUBLE_TYPE) {
    carDouble = 1;
  } 
  if (car(cdr(args))->type == DOUBLE_TYPE) {
    cdrDouble = 1;
  }
  if (!cdrDouble && !carDouble) {
    if (scar->i > scdr->i) {
      result->i = 1;
    }
  }
  return result;
}

//use test41.scm
Value *evalMultipy(Value *numbers){
  Value *result = talloc(sizeof(Value));
  result->type = INT_TYPE;
  result->i = 1;
  int isDouble = 0;
  while(car(numbers)!=NULL){
    Value *subj = car(numbers);
    if (subj->type == INT_TYPE || subj->type == DOUBLE_TYPE) {
      if(subj->type == DOUBLE_TYPE && isDouble == 0){
          isDouble = 1;
          double d = result->i;
          result->type = DOUBLE_TYPE;
          result->d = d;
      }else if (subj->type == DOUBLE_TYPE) {
        isDouble = 1;}
      if(isDouble == 1){
          result->d = result->d * subj->d;
      }else{
          result->i = result->i * subj->i;}
    }else{
    printf("22");
    evaluationError();}  
    numbers = cdr(numbers);
  }
  return result;
}

Value *evalDivide(Value *numbers){
  Value *result = talloc(sizeof(Value));
  result->type = INT_TYPE;
  Value *scar = car(numbers);
  Value *scdr = car(cdr(numbers));
  int carDouble = 0;
  int cdrDouble = 0;
  if (car(numbers)->type == DOUBLE_TYPE) {
    carDouble = 1;
  } 
  if (car(cdr(numbers))->type == DOUBLE_TYPE) {
    cdrDouble = 1;
    if (car(cdr(numbers))->d == 0) {
      return car(cdr(numbers));
    }
  } else {
    if (car(cdr(numbers))->i == 0) {
      return car(cdr(numbers));
    }
  }
  if (cdrDouble == 0 && carDouble == 0) {
    if (evalMod(numbers)->i == 0) {
      result->i = scar->i / scdr->i;
    }else{
      Value *castCar = makeNull();
      castCar->type = DOUBLE_TYPE;
      castCar->d = scar->i;
      Value *castCdr = makeNull();
      castCdr->type = DOUBLE_TYPE;
      castCdr->d = scdr->i;
      result->type = DOUBLE_TYPE;
      result->d = castCar->d / castCdr->d;
    }
  }else{
    result->type = DOUBLE_TYPE;
      Value *castCar = makeNull();
      castCar->type = DOUBLE_TYPE;
      if(carDouble == 1){
        castCar->d = scar->d;
      }else{
        castCar->d = scar->i;
      }
      Value *castCdr = makeNull();
      castCdr->type = DOUBLE_TYPE;
      castCdr->d = scdr->i;
      if(cdrDouble == 1){
        castCdr->d = scdr->d;
      }else{
        castCdr->d = scdr->i;
      }
      result->d = castCar->d / castCdr ->d;
      if(result->d == 0){
        double d = result->d;
        result->type = INT_TYPE;
        result->i = d;
      }
  }
  return result;
  
}

Value *evalMinus(Value *numbers) {
  Value *diff = talloc(sizeof(Value));
  diff->type = INT_TYPE;
  int isDouble = 0;
  if (car(numbers)->type == INT_TYPE) {
    diff->i = car(numbers)->i;
  } else if(car(numbers)->type == DOUBLE_TYPE) {
    diff->d = car(numbers)->d;
    isDouble = 1;
  }//might need copy idk
  numbers = cdr(numbers);
  while(numbers->type != NULL_TYPE){
    Value *subj = car(numbers);
    if (subj->type == INT_TYPE || subj->type == DOUBLE_TYPE) {
      if(subj->type == DOUBLE_TYPE && isDouble ==0){
          isDouble = 1;
          double d = diff->i;
          diff->type = DOUBLE_TYPE;
          diff->d = d;
      } else if (subj->type == DOUBLE_TYPE) {
        isDouble = 1;}
      if(isDouble == 1){
        diff->d = diff->d - subj->d;
      }else{
        diff->i = diff->i - subj->i;}
    }else{
      printf("23");
    evaluationError();}  
    numbers = cdr(numbers);
  }
  return diff;
}

Value *evalAdd(Value *numbers){
  Value *sum = talloc(sizeof(Value));
  sum->type = INT_TYPE;
  int isDouble = 0;
  sum->i = 0;
  while(numbers->type != NULL_TYPE){
    Value *subj = car(numbers);
    if (subj->type == INT_TYPE || subj->type == DOUBLE_TYPE) {
      if(subj->type == DOUBLE_TYPE && isDouble ==0){
          isDouble = 1;
          double d = sum->i;
          sum->type = DOUBLE_TYPE;
          sum->d = d;
      } else if (subj->type == DOUBLE_TYPE) {
        isDouble = 1;}
      if(isDouble == 1){
        sum->d = sum->d + subj->d;
      }else{
        sum->i = sum->i + subj->i;}
    }else{
      
      printf("24");
    evaluationError();}  
    numbers = cdr(numbers);
  }
  return sum;
}

Value *evalNull(Value *args) {
  Value *result = talloc(sizeof(Value));
  result->type = BOOL_TYPE;
  result->i = 0;
  if (args->type == NULL_TYPE) {
    result->i=1;
  } else if (args->type == CONS_TYPE && car(args)->type == CONS_TYPE && car(car(args))->type == NULL_TYPE) {
    result->i=1;
  }
  else if (args->type ==CONS_TYPE && car(args)->type == NULL_TYPE) {
    result->i=1;
  }
  return result;
}

Value *evalCar(Value *args){
  return car(car(args));
}

Value *evalCdr(Value *args){
  if (car(args)->type == NULL_TYPE) {
    printf("evalcdr null\n");
    fflush(stdout);
  }
  Value *result = cdr(car(args));
  return result;
}

Value *evalCons(Value *args) {
  Value *result = makeNull();
  result->type = CONS_TYPE;
  Value *innerList;
  Value *arg1 = car(args);
  Value *arg2 = car(cdr(args));
  result = cons(arg1,arg2);
  return result;
}

Value *evalBegin(Value *args, Frame *frame){
  Value *voidresult = talloc(sizeof(Value));
  voidresult->type = VOID_TYPE;
  if (car(args)->type == NULL_TYPE) {
    return voidresult;
  }
  Value *indResult;
  Value *resultList = makeNull();
  //eval args return result of last
  while (args->type != NULL_TYPE ) {
    //printTree(car(args));
    indResult = eval(car(args), frame);

    resultList = cons(indResult, resultList);
    args = cdr(args);
  }
  return car(resultList);
}

Value *evalLetRec(Value *args, Frame *newFrame) {
  Value *bindings = car(args);
  Value *bodies = cdr(args);
  //printTree(bodies);
  
  while (bindings->type != NULL_TYPE) {
    //eval e1..en
   
    Value *evald = eval(car(cdr(car(bindings))),newFrame);
    //bind xi to ei
    if (evald->type == CLOSURE_TYPE) {
      //printf("binding %s to closure\n", car(car(bindings))->s);
    }
    Value *newBind = cons(car(car(bindings)), evald);
    
    newFrame->bindings = cons(newBind, newFrame->bindings);

    bindings = cdr(bindings);
  }
  
  //eval bodies in order
  Value *resultList = makeNull();
  //printTree(bodies);
  while (bodies->type != NULL_TYPE) {
    //printf("calling %s\n", car(car(bodies))->s);
    
    Value *indResult = eval(car(bodies), newFrame);
    //printf("check\n");
    resultList = cons(indResult, resultList);
    bodies = cdr(bodies);
  }
  return car(resultList);
  //return makeNull();
}

//evaluate bindings for let
Value *evalLet(Value *bindings, Frame *frame) {
  Value *result = makeNull();
  Value *copyBindings= bindings;
  while (copyBindings->type != NULL_TYPE) {
    Value *evald = eval(car(cdr(car(copyBindings))),frame);
    Value *newBind = cons(car(car(copyBindings)),evald);
    result = cons(newBind,result);
    copyBindings = cdr(copyBindings);
  }
  return result;}

Frame *evalLetStar(Value *bindings, Frame *frame) {
  Value *result = makeNull();
  Value *copyBindings= bindings;
  Frame *newFrame;
  while (copyBindings->type != NULL_TYPE) {
    Value *evald = eval(car(cdr(car(copyBindings))),frame);
    newFrame = talloc(sizeof(Frame));
    newFrame->parent = frame;
    newFrame->bindings = makeNull();
      
    Value *newBind = cons(car(car(copyBindings)),evald);//problem?
    newFrame->bindings = cons(newBind,newFrame->bindings);
    copyBindings = cdr(copyBindings);
    frame = newFrame;
  }
  return newFrame; //frame of last binding
}

//checks for duplicate bindings
void verifyBindings(Value *bindings) {
  Value *bindcopy = bindings;
  Value *head = bindings;
  int success = 0;
  while (bindings->type != NULL_TYPE) {
    Value *symbol = car(car(bindings));
    while (bindcopy->type !=NULL_TYPE) {
      if (!strcmp(symbol->s, car(car(bindcopy))->s)) {
        success++;}
      bindcopy = cdr(bindcopy);}
    bindcopy = head;
    bindings = cdr(bindings);}
  if (success > length(head)) {
    printf("2");
    evaluationError();
  }
}

//cehck for duplicate params in lambda
void verifyArgs(Value *args) {
  Value *argscopy = args;
  Value *head = args;
  int success = 0;
  while (args->type != NULL_TYPE) {
    Value *symbol = car(args);
    while (argscopy->type !=NULL_TYPE) {
      if (!strcmp(symbol->s, car(argscopy)->s)) {
        success++;}
      argscopy = cdr(argscopy);}
    argscopy = head;
    args = cdr(args);
  }
  if (success > length(head)) {
    printf("11: duplicate arrrrrgs.. no pirates\n");
    evaluationError();
}}

void evalSet(Value *expr, Value *unval, Frame *frame) { 
  Frame *framecopy = frame;
  Value *copyBindings = frame->bindings;
  
  //printResult(unval);
  Value *newBind;
  Value *modTopBindings = makeNull();
  Value *val = eval(unval,frame);
  int success = 0;
  while(framecopy != NULL) {
    copyBindings = framecopy->bindings;
    while ( copyBindings->type != NULL_TYPE) {
      if (!strcmp(expr->s,car(car(copyBindings))->s) && success == 0) {
        //printf("set");//set
        newBind = cons(car(car(copyBindings)), val);
        modTopBindings = cons(newBind, modTopBindings);
        success = 1;
      }else {
      modTopBindings = cons(car(copyBindings), modTopBindings);
      }
      copyBindings = cdr(copyBindings); 
    }
    framecopy->bindings = modTopBindings;
    framecopy = framecopy->parent;
  }
  
  //framecopy->bindings = modTopBindings;
}

Value *lookUpSymbol(Value *expr, Frame *frame) { 
  //printf("start lookup for %s\n", expr->s);
  Frame *framecopy = frame;
  Value *copyBindings = frame->bindings;
  
  while(framecopy != NULL) {
    
    copyBindings = framecopy->bindings;
    //printResult(copyBindings);
    while ( copyBindings->type != NULL_TYPE) {
      //printf("lookup %s\n", car(car(copyBindings))->s);
      if (!strcmp(expr->s,car(car(copyBindings))->s)) {
          return cdr(car(copyBindings));
         
      }
      copyBindings = cdr(copyBindings); 
    }
    framecopy = framecopy->parent;
  }
  while (copyBindings->type != NULL_TYPE) {
      //printf("lookup %s\n", car(car(copyBindings))->s);
      if (!strcmp(expr->s,car(car(copyBindings))->s)) {
        return cdr(car(copyBindings));
      } 
    copyBindings = cdr(copyBindings);
  }
  //printf("failure");
  return makeNull();
}

Value *apply(Value *function, Value *args) {
  Value *result = makeNull();
  Frame *parFrame = function->closure.frame;
  Frame *newFrame = talloc(sizeof(Frame));
  newFrame->parent = parFrame;
  newFrame->bindings = makeNull();
  //bind args to closure.params
  if (function->type == CLOSURE_TYPE) {
    Value *paramsToBind = function->closure.paramNames;
    Value *argscopy = args;
    while (paramsToBind->type != NULL_TYPE) {
      if (argscopy->type == NULL_TYPE) {
      } else {
        //printf("binding %s\n", car(paramsToBind)->s);
        Value *newBinding = cons(car(paramsToBind),car(argscopy));
        newFrame->bindings = cons(newBinding,newFrame->bindings);
      }
      //if (paramsToBind->type == SYMBOL_TYPE) {
      //printf(" b%s\n", paramsToBind->s);
      //}
      //fflush( stdout );
      paramsToBind = cdr(paramsToBind);
      
      argscopy = cdr(argscopy);
    } //by now should have all args bound in frame bindings
    //eval closure.body in new frame
    result = eval(function->closure.fnBody,newFrame);
    
  } else {//is a primitive type
    if(function->type == PRIMITIVE_TYPE) {
      //printf("fn prim \n");
    }
    //printf("fn prim %i\n", function->type);
    result = (*function->primFn)(args);
    return result;
  }
  return result;
}

Value *evalIf(Value *args, Frame *frame) {
  int truthy = 0;
  Value *result = talloc(sizeof(Value));
  Value *test = eval(car(args),frame); //eval x
  Value *evaltest = eval(test,frame);
  switch (evaltest->type)  {
     case INT_TYPE: {
        if (evaltest->i != 0) {
          truthy = 1;}
        break;}
     case BOOL_TYPE: {
        if (evaltest->i != 0) {
          truthy = 1;}
        break;}  
     case SYMBOL_TYPE: {
        if(lookUpSymbol(evaltest, frame)->i != 0) {
          truthy = 1;}
        break;}  
     default:
       break;}
       
     if (truthy ==1 ) {
      result =  eval(car(cdr(args)),frame);//first item
    } else {
      result = eval(car(cdr(cdr(args))),frame);//second item
  }
  return result;
}
 
//Evaluates the S-expression referred to by expr in the given frame.
Value *eval(Value *expr, Frame *frame){
  Value *result = makeNull();
  Frame *framecopy = frame;
  switch (expr->type)  {
     case INT_TYPE: {
        result =  expr;
        break;}
     case BOOL_TYPE: {
        result =  expr;
        break;}  
     case SYMBOL_TYPE: {
        //printf("looking for %s: ", expr->s);
        result =  lookUpSymbol(expr, framecopy);
        //printf("found");
        //printResult(result);
        //used to call lookup error here
        break;
        }  
     case CONS_TYPE: {
        Value *first = car(expr);
        Value *args = cdr(expr);
        if (first->type == SYMBOL_TYPE) {
          //printf("sym %s\n", first->s);
        }
        if (!strcmp(first->s,"if")) {
            result = evalIf(args,frame);

        } else if (!strcmp(first->s,"let")) {
          Frame *newFrame = talloc(sizeof(Frame));
          newFrame->parent = frame;
          newFrame->bindings = makeNull();
          Value *bindings = car(args); 
          Value *bindcheck = bindings;
          if (bindings->type != CONS_TYPE && bindings->type != NULL_TYPE) {
            printf("5");
            evaluationError();
            return makeNull();
          }  
          Value *evalBindings = evalLet(bindings, frame);
          newFrame->bindings = evalBindings; 

          if(bindings->type == CONS_TYPE){
            if (car(bindings)->type == NULL_TYPE || car(bindings)->type != CONS_TYPE || car(car(bindings))->type != SYMBOL_TYPE){
              printf("6");
              evaluationError();
              return makeNull();
            }    
          }
          //check len body and execute last (up to 3)
          if (cdr(args)->type != NULL_TYPE) { //let evals all bindings
            if (length(cdr(args))==1) {
        
            result = eval(car(cdr(args)), newFrame);
            } else if (length(cdr(args))==2){
              result = eval(car(cdr(cdr(args))), newFrame);
            } else {result = eval(car(cdr(cdr(cdr(args)))), newFrame);}
          } 
          else {
            printf("7: exiting");
            evaluationError();
          } //>3
          //check for duplicates
          verifyBindings(bindcheck);

        }
        else if (!strcmp(first->s,"letrec")) {
          Frame *newFrame = talloc(sizeof(Frame));
          newFrame->bindings = makeNull();
          newFrame->parent = frame;
          //frame = newFrame;
          result = evalLetRec(args, newFrame);
          
        }
        
        else if (!strcmp(first->s,"let*")) {
          //evalletstar creates frames with bindings
          //and returns new frame
          Frame *newFrame = evalLetStar(car(args), frame);
          //eval body in that frame
          result = eval(car(cdr(args)), newFrame);
        }
        else if (!strcmp(first->s,"set!")) {
          Value *val = car(cdr(args));
          //printf("args ");
          //printTree(args);
          //printf("valtype %i ", val->type);
          //printf("\n");
          evalSet(car(args), val, frame);
          Value *voidresult = talloc(sizeof(Value));
          voidresult->type = VOID_TYPE;
          return voidresult;
        }
        else if (!strcmp(first->s,"begin")) {
          result = evalBegin(args, frame);
        }
        else if (!strcmp(first->s,"quote")) {
          if(args->type == NULL_TYPE){
            printf("8: quote null");
            evaluationError();
          }
          if(cdr(args)->type == CONS_TYPE){
            printf("9: quote cons");
            evaluationError();
          }
          if (car(args)->type == NULL_TYPE) {
            result = args;
          }else{
            result = car(args);}
          return result;

        }else if (!strcmp(first->s,"define")) {
          Frame *topFrame = goToTop(frame);
          //add binding of expr to top frame
            if(args == NULL || args->type == NULL_TYPE || cdr(args)->type == NULL_TYPE){
              printf("12");
              evaluationError();
            }
            Value *evalbind = eval(car(cdr(args)),frame);
            Value *newBind = cons(car(args),evalbind);
            if(car(args)->type != SYMBOL_TYPE ){
             printf("13");
              evaluationError();
            }
            if(car(cdr(args))->type == SYMBOL_TYPE){
              if(!strcmp(car(args)->s, car(cdr(args))->s)){
                  printf("14");
                  evaluationError();
              }
            }
          Value *newBindings = cons(newBind,topFrame->bindings);
          topFrame->bindings = newBindings;
          Value *voidresult = talloc(sizeof(Value));
          voidresult->type = VOID_TYPE;
          return voidresult;

        }else if (!strcmp(first->s,"lambda")) {
            Value *newClosure = talloc(sizeof(Value));
            newClosure->type = CLOSURE_TYPE;
            //point to current frame
            newClosure->closure.frame = frame;
            
            if (args == NULL || args->type == NULL_TYPE) {
              printf("15");
              evaluationError();
            }
            
            if (args != NULL && args->type != NULL_TYPE && car(args)->type != NULL_TYPE && car(car(args))->type == INT_TYPE) {
              printf("16: type error in lambda");
              evaluationError();
            }
            if (args != NULL && args->type != NULL_TYPE && car(args)->type != NULL_TYPE && car(car(args))->type == NULL_TYPE) {
              printf("17: type error in lambda");
              evaluationError();
            }
            
            if (length(car(args)) >= 2) {
            verifyArgs(car(args));}
            if (cdr(args) == NULL || (cdr(args))->type == NULL_TYPE) {
              printf("18");
              evaluationError();
            }
            newClosure->closure.paramNames = car(args);
            newClosure->closure.fnBody = car(cdr(args)); //pass let to closure
          return newClosure;
        } else if (!strcmp(first->s,"and")){
          Value *arg2;
          Value *arg1 = eval(car(args), frame);

          if (arg1->i == 0) {
            result =  arg1;
          }else {

            if (cdr(args)->type != NULL_TYPE) {
              arg2 = eval(car(cdr(args)), frame);
            } else {
              arg2 = talloc(sizeof(Value));
              arg2->type = BOOL_TYPE;
              arg2->i=1;
            }
            if (arg1->i == 1 && arg2->i == 1) {
              result =  arg1;
            } else if (arg1->i == 0) {
              result =  arg1;
              
            } else {result = arg2;}
            //printf("andresult %i\n", result->i);
          }
        } else if (!strcmp(first->s,"or")){
          Value *orresult = talloc(sizeof(Value));
          orresult->type = BOOL_TYPE;
          orresult->i=0;

          Value *arg2;
          Value *arg1 = eval(car(args), frame);
          if (cdr(args)->type != NULL_TYPE && arg1->i == 0) {
            arg2 = eval(car(cdr(args)), frame);
          } else {
            arg2 = talloc(sizeof(Value));
            arg2->type = BOOL_TYPE;
            arg2->i=0;
          }
          if (arg1->i == 1 || arg2->i == 1) {
            orresult->i = 1;
          }
            //printf("result %i, args %i\n", orresult->i, arg1->i);
            result = orresult;
        }
        // .. other special forms here...
        else {
          
          //expect lambda soon
           Value *funct = eval(first,frame); //get a closure
           //printf("funct %i ", funct->type);
           //eval args in a while loop
           Value *evaldargs = makeNull();
           while (args->type != NULL_TYPE) {
              evaldargs = cons(eval(car(args),frame), evaldargs);
              args = cdr(args);
           }
           evaldargs = reverse(evaldargs);
           result = apply(funct,evaldargs);
        }
        break;
     }
     case DOUBLE_TYPE:{
       result = expr;
       break;}
     case STR_TYPE: {
      result = expr;
       break;}
     default:
       break;
    }
    return result;
}

//Interprets each top level S-expression in the tree 
//and prints out the results.
void interpret(Value *tree) {
  Value *result;
  Frame *parent = talloc(sizeof(Frame));
  parent->parent = NULL;
  parent->bindings = makeNull();

  bind("null?", evalNull, parent);
  bind("+", evalAdd, parent);
  bind("cons", evalCons, parent);
  bind("cdr", evalCdr, parent);
  bind("car", evalCar, parent);

  bind("-", evalMinus, parent);
  bind(">", evalGreater, parent);
  bind("=", evalEquals, parent);
  bind("<", evalLess, parent);
  bind("*", evalMultipy, parent);
  bind("/", evalDivide, parent);
  bind("modulo", evalMod, parent);

  while (tree->type != NULL_TYPE) {
    result = eval(car(tree),parent);
    //printf("printing");
    printResult(result);
    printf(" ");
    tree = cdr(tree);
  }
}
