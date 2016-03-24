tryCatch(needs(), error = function(e) {
  while (".needs" %in% search()) detach(.needs)
  .needs <- new.env(parent = .GlobalEnv)
  .needs$needs <- function(...) 
{
    needs_ <- function(...) {
        pkgs <- unlist(...)
        if (length(pkgs)) {
            loaded <- suppressMessages(suppressWarnings(sapply(pkgs, 
                library, character = T, logical = T)))
            if (any(!loaded)) {
                missing <- pkgs[!loaded]
                cat("installing packages:n")
                cat(missing, sep = "n")
                utils::install.packages(missing, repos = "http://cran.rstudio.com/", 
                  quiet = T)
            }
            suppressMessages(suppressWarnings(sapply(pkgs, library, 
                character = T)))
        }
    }
    packageInfo <- utils::installed.packages()
    if (missing(...)) 
        return(invisible())
    pkgs <- match.call()[-1]
    parsed <- if (is.null(names(pkgs))) {
        as.character(pkgs)
    }
    else {
        mapply(paste, names(pkgs), as.character(pkgs), MoreArgs = list(sep = ":"))
    }
    parts <- lapply(strsplit(parsed, "[:=(, ]+"), function(d) {
        d[d != ""]
    })
    grouped <- split(parts, sapply(parts, length))
    needs_(grouped$`1`)
    toCheck <- grouped$`2`
    if (length(toCheck)) {
        installedPackages <- packageInfo[, "Package"]
        needsPackage <- sapply(toCheck, `[`, 1)
        needsVersion <- sapply(toCheck, function(x) {
            gsub("[^0-9.-]+", "", x[2])
        })
        installed <- needsPackage %in% installedPackages
        needs_(needsPackage[!installed])
        compared <- mapply(utils::compareVersion, needsVersion[installed], 
            packageInfo[needsPackage[installed], "Version"])
        if (any(compared == 1)) {
            toUpdate <- needsPackage[installed][compared == 1]
            cat("updating packages:n")
            cat(toUpdate, sep = "n")
            utils::update.packages(oldPkgs = toUpdate, ask = F)
        }
        needs_(needsPackage[installed])
    }
    invisible()
}

  # attach to the search path
  attach(.needs)
})
