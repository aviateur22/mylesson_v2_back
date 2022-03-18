# format des données recus par le front et renvoyé lors des requetes:

## données 
- cookie connect.sid : gestion server


- chiffrage d'un cookie "ident" : `${id}/${token.value}`;
> possede le token utilisateur et son id

- chiffrage d'une clé pour le front ("id") : `userid:${id}`;
> possede id de l'utilisateur

## API
### Connexion 
Si succés, génération d'un:
- cookie ident avec token utilisateur
- mise en session ("coté front") de la clé "id" 

### Requête API
- A chaque requête envoie d'un cookie connect.sid connetant id de l'utilisateur
- Le corps de la requete doit systematiquement envoie dans le corps des requete une clé 

response.error => erreur serveur ou erreur dans la requete 4.. ou 5..
reponse.resetAuth => demande de réinitilisation front car tentavive d'acces à une zone protégée

