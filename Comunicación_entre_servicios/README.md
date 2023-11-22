# Parcial Docker-Swarm-Rest-Soap
## Alumno: Montellano Marcos
```markdown
Este proyecto contiene una aplicación que utiliza servicios SOAP y REST, implementados con Node.js y MySQL, y se ejecuta en contenedores Docker. La aplicación consulta y muestra datos de alumnos a través de servicios SOAP y REST.

## Configuración del Entorno

1. **Clonar el Repositorio:**
   ```bash
   git clone <URL del repositorio>
   cd <nombre-del-repositorio>
```
El resto de los pasos esta en el archivo pasos.txt. Esos son los pasos que hice para realizar este examen
#### Imagenes
* Base de datos - imagen: basededatos
* Servicio Rest - imagen: rest_tp
* Servicio Soap - imagen: soap_tp 
* Front - imagen: front_tp

### Inicializar Docker Swarm

	1)- docker swarm init
	2)- docker stack deploy -c docker-compose.yml swarm_tp
