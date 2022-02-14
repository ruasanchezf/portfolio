# Final Project for Data Visualization

This was a partner assignment for the final project in my Data Visualization class during my junior year at Carleton.
My partner for this project was Martin Bernard. We chose a heavy topic in response to the death of George Floyd and the 
BLM movement at the time. The data visualization takes data of police shootings since

https://observablehq.com/d/963c347c4833b443@2585

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
npx http-server
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@4
npm install https://api.observablehq.com/d/963c347c4833b443@2585.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "963c347c4833b443";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
