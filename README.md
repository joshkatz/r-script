# r-script

A simple little module for passing data from NodeJS to R (and back again).

Contains both synchronous and asynchronous methods.

### Installation
```
npm install r-script
```

### Example

```js
var R = require("r-script");
```

##### Synchronous
```r
# ex-sync.R
needs(magrittr)
set.seed(512)
do.call(rep, input) %>% 
  strsplit(NULL) %>% 
  sapply(sample) %>% 
  apply(2, paste, collapse = "")
```


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


##### Asynchronous
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
