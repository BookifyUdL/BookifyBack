# API Documentation
## **UML Diagram:**

![Bookify UML](https://github.com/BookifyUdL/BookifyBack/blob/master/UML%20Diagram.png)

## Steps to execute server
#### 1. Clone the project to your computer(via HTTPS or SSH)
- Https: git clone https://github.com/BookifyUdL/BookifyBack.git
- Ssh: git clone git@github.com:BookifyUdL/BookifyBack.git

#### 2. Download Node.js
- Download it from here: https://nodejs.org/es/download/

#### 3. Download all project dependencies
You must be inside the project and then execute the following instruction:
```npm install --save```

#### 4.Run the server
You must be inside the project and then execute the following instruction:
``` npm start ```

IMPORTANT: Whenever you change something on the server you just have to save and it reuploads it automatically.

## API EndPoints
Global End Point: https://localhost:3000/
Entities End Points: 
```
{
  "Books": "https://localhost:3000/books",
  "Authors": "https://localhost:3000/authors",
  "Comments": "https://localhost:3000/comment",
  "Users": "https://localhost:3000/users",
  "Achievements": "https://localhost:3000/achievements",
  "Shops": "https://localhost:3000/shops",
  "Genres": "https://localhost:3000/genres",
  "Items": "https://localhost:3000/items"
}
```

## API examples (POST, GET, PATCH, DELETE)
This are just examples, try the other endpoints on your own.
### POST 
Send POST to the endpoint https://localhost:3000/genres to create a resource.
Body:
```
  {
    "name": "Java"
  }
 ```
### GET
Send GET to the endpoint: https://localhost:3000/genres to get all resources.
Body: None

Send GET to the endpoint: https://localhost:3000/genres/:id to get a specific resource. (id --> entity id value)
Body: None

### PATCH
Send PATCH to the endpoint: https://localhost:3000/genres/:id to update/modify a specific resource. (id --> entity id value)
```
[
  {
    "propName":"name", "value": "Adventure"
  }
]
```
IMPORTANT: Add as much lines as properties of that entity you want to change.

### DELETE
Send DELETE to the endpoint: https://localhost:3000/genres:id to delete a specific resource. (id --> entity id value)
Body: None



