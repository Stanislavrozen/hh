$projectPath = ($PWD.Path -replace '\\','/')

docker run -it -d --name hh -v "${projectPath}:/hh" -w /hh/server -p 6006:6006 node:alpine npm run dev