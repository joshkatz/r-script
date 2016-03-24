# r-script

A simple little module for passing data from NodeJS to R (and back again).

Data passed from node is converted into a list and loaded into the R environment as the variable `input`. No special syntax in R is needed. For better portability/reliability, it's recommended to load packages with [`needs`](https://github.com/joshkatz/needs) (comes packaged inside the module — no installation required).

### Installation
```
npm install r-script
```

### Example

```js
var R = require("r-script");
```

##### Synchronous
```javascript
// example.js

var out = R("ex-sync.R")
  .data("hello world", 20)
  .callSync();
  
console.log(out);

// [ 'oedorlwlh l', 'oldlrhelwo ', 'erllol dhow', ' lwrellodoh', 'holdlerw ol',
//   'lrlewdhol o', 'lll wohdeor', 'hwrlledl oo', 'elrooh lwld', 'ewrlo lhdlo',
//   'hlloroelwd', 'h eodollwlr', 'wr ldleohlo', 'or ohldlwel', 'lohe lowlrd',
//   'rhdwoelllo ', 'owhorldell ', 'rlle ohdolw', 'rhlwolle od', 'woro helldl' ]
```

```r
# ex-sync.R
needs(magrittr)
set.seed(512)
do.call(rep, input) %>% 
  strsplit(NULL) %>% 
  sapply(sample) %>% 
  apply(2, paste, collapse = "")
```


##### Asynchronous

```javascript
// example.js

var attitude = JSON.parse(
  require("fs").readFileSync("example/attitude.json", "utf8"));

R("example/ex-async.R")
  .data({df: attitude, nGroups: 3, fxn: "mean" })
  .call(function(err, d) {
    if (err) throw err;
    console.log(d);
  });
  
// [ { group: '(40,55]', rating: 46.7143, advance: 41.1429 },
//   { group: '(55,70]', rating: 64.6154, advance: 41.9231 },
//   { group: '(70,85]', rating: 77.2, advance: 45.5 } ]
```

```r
# ex-async.R
needs(dplyr)
attach(input[[1]])

return("early returns are ignored")
cat("so are undirected calls to cat")
print("or print")
cat("unless directed to a file", file = "out.Rout")

# output of final expression is returned to node
df %>% 
  mutate(group = cut(rating, nGroups, ordered = T)) %>% 
  group_by(group) %>% 
  summarize_each(funs_(fxn)) %>%
  select(group, rating, advance) %>%
  mutate(group = as.character(group))
```

### Syntax

**R**(_path_)

Creates a new object that will source the R script specified by _path_.

R.**data**(...)

Adds data to the object and returns itself. You can give any number of arguments of different types. 

R.**call**([_options_], _callback_)

Calls R. Any previously supplied _data_ is stringified into JSON and passed to R, where it's converted into a list and loaded into the R environment as the variable `input`. On completion, the _callback_ is invoked with two arguments: any error and the output from R, parsed back into a Javascript object.

Additional arguments for the conversion from R to JSON can be specified as _options_ (see documentation for [```toJSON```](https://github.com/jeroenooms/jsonlite/blob/master/R/toJSON.R) from the R package `jsonlite` for defaults).

R.**callSync**([_options_])

The same as above, but calls R synchronously.
