# RComponents

## Running development mode
```console
  root@r-components:~$ npm i -g @nrwl/cli
  root@r-components:~$ npm i
  root@r-components:~$ nx serve demo
  root@r-components:~$ nx serve r-docs-gateway //separate shell
```
- Demo app builds the component lib on save
- Saving a file from r-docs library will trigger rebuild and fresh restart of both r-docs-gateway and demo app
