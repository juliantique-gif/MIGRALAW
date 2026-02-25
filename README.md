git add .
git commit -m "Initial commit"
git push 

sirve para guardar los archivos
copiar y pegar en el terminal, si no sabe como 
entrar se entra con ctrl + ñ

git pull

sirve para descargar lo que 
los demas hagan


 eror si no le deja guardar

Guardar al resolver un conflicto de Git

Abres el archivo con conflicto.

Arreglas el contenido (eliminas <<<<<<<, =======, >>>>>>>).

Ctrl + S para guardar.

Luego en la terminal:

git add .
git rebase --continue


SIRVE PARA VER EL ERROR REAL
git status
git remote -v
git branch

subir cambios y bajar los nuevos

git add
git commit -m
git pull --rebase
git push

baja lo que este en git y reescribe lo que tienes
git pull --rebase origin main
git push origin main

si aparece conflicto  coloca
git status