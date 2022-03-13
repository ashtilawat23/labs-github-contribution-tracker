# Labs GitHub Contribution Tracker

Project created with ```npm init -y```.  

### To setup this project locally, please do the following:

1. Fork this repo to your personal account. 
2. Clone this repo on to your machine in your desired dir. 
3. Use ```cd``` to navigate into the repo using your terminal. 
4. Delete the ```db.json``` file in the root directory of this project. 
5. Use ```npm i``` to download the dependencies for this project. 
6. Use ```npm run dev``` to run the server locally. 

### Note the following before adding/updating to this repo: 

- Some of our dependences, like ```lowdb```, are purely ESM packages. You must use ```import ...```/```export...``` in any file you add/update in this repo. 
- In addition, please maintain ```"type":"module"``` in the package.json to ensure working imports. 

> For more info on using pure ESM packages, use this useful [guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)!

### Teams Object Types

```
teams: [
    name: {
        teamSlug: string,
        teamId: number,
        members: Array<string>,
        repos: Array<string>,
    }
]
```