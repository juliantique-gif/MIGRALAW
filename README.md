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

trae los cambios de git los coloca encima los cambios
evita duplicados

git pull origin main --rebase
git push origin main