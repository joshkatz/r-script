source(file.path(Sys.getenv("DIRNAME"), "needs.R"))
needs(jsonlite)

run <- function(dataIn) {

  # set up environment
  input <- unname(dataIn[[1]])
  .e <- as.environment(list(
    path = dataIn[[2]],
    out = modifyList(list(x = NULL, auto_unbox = T),
      dataIn[[3]], keep.null = T)
  ))
  lockBinding(".e", environment())

  # run source, capture output
  captured <- tryCatch(capture.output({
    temp <- source(.e$path, local = T)$value
  }), error = function(err) err)
  unlockBinding(".e", environment())

  # process and return
  if (inherits(captured, "error")) {
    msg <- conditionMessage(captured)
    cat("Error in R script", .e$path, "\n", sQuote(msg), file = stderr())
    return(invisible(F))
  }
  .e$out$x <- if (is.null(temp)) {
     ""
  } else {
    temp
  }
  do.call(toJSON, .e$out)

}

suppressWarnings(
  run(fromJSON(Sys.getenv("input")))
)
