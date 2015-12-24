# ex-async.R
needs(dplyr)
attach(input[[1]])

return("early returns are ignored")
cat("so are undirected calls to cat")
print("or print")
cat("unless directed to a file", file = "out.Rout")

# output of final expression is returned to parent
df %>% 
  mutate(group = cut(rating, nGroups, ordered = T)) %>% 
  group_by(group) %>% 
  summarize_each(funs_(fxn)) %>%
  select(group, rating, advance) %>%
  mutate(group = as.character(group))