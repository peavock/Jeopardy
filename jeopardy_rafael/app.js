class Jeopardy {
    constructor(numCat, numQue) {
        this.numCat = numCat;
        this.numQue = numQue;
        this.categories = [];
        this.questions = [];
    }
    
    async getCategories() {
        //always get all 100 categories and then randomly select the needed number of them
        let response = await axios.get("http://jservice.io/api/categories", {params: {count: 100}});
        let sampledIds = this.sampling();
        this.categories = sampledIds.map((id) => response.data[id]);
    }

    async getClues(category) {
        let response = await axios.get("http://jservice.io/api/clues", { params: {category} });
        return response.data;
    }

    async getAllQuestions() {
        // get questions for all the categories and keep only the properties that are needed.
        for(let i = 0; i < this.numCat; i++) {
            let questionsForCat = await this.getClues(this.categories[i]["id"]);

            //get top x(numQue) number of questions for any category
            for(let j = 0; j < this.numQue; j++) 
                this.questions.push(questionsForCat[j]);
        }
        this.questions = this.questions.map( (que) => {
            return {
                    "id": que["id"],
                    "question": que["question"],
                    "answer": que["answer"],
                    "categoryId": que["category_id"],
                    "colId": null
            }
        });
    }

    sampling() {
        //create an array of 6 random indices that would correspond to the indices of the categories we need. This would return non-repetitive 6 random indices between 0 and 99
        let sampledIds = [];
        for(let i = 0; i < this.numCat; i++) {
            let number = Math.floor(Math.random() * 100);
            while (sampledIds.includes(number)) {
                number = Math.floor(Math.random() * 100);
            }
            sampledIds.push(number);
        }
        return sampledIds;
    }

    async createHtml() {
        let cat = document.getElementById("categories");
        let row = document.createElement("tr");
        
        //create the categories header
        for(let i = 0; i < this.numCat; i++) {
            let col = document.createElement("th");
            col.innerText = this.categories[i]["title"];
            row.append(col);
        }
        cat.append(row);

        //create the questions rows and columns
        const questionRows = document.getElementById("questions");
        for(let i = 0; i < this.numQue; i++) {
            let newRow = document.createElement("tr");
            for(let j = 0; j < this.numCat; j++) {
                let newCol = document.createElement("td");
                newCol.innerText = "?";
                newCol.setAttribute("id", `${j}-${i}`);
                newRow.append(newCol);
            }
            questionRows.append(newRow);
        }
    }

    assignQuestions() {
        //assign question to each cell of the table. Add column ids to all the questions.
        for(let i = 0, q = 0; i < this.numCat; i++) {
            for(let j = 0; j < this.numQue; j++, q++)
                this.questions[q]["colId"] = `${i}-${j}`;
        }        
    }
    
    async createBoard() {
        await this.getCategories();
        await this.getAllQuestions()
        this.createHtml();
        this.assignQuestions();
    }

    getQuestionForCol(colId) {
        return this.questions.find((que) => que["colId"] === colId);
    }

}

const handleClick = (event) => {
    let id = event.target.id;
    let targetCol = document.getElementById(id);
    if(!targetCol.getAttribute('data-open')) {
        let question = game.getQuestionForCol(id)["question"];
        targetCol.innerText = question;
        targetCol.setAttribute('data-open', 'question');
    } else if(targetCol.getAttribute('data-open') === 'question') {
        let answer = game.getQuestionForCol(id)["answer"];
        targetCol.innerText = answer;
        targetCol.setAttribute('data-open', 'answer');
    }
    
}

let game = new Jeopardy(6, 5);
game.createBoard();
let questionsDiv = document.getElementById("questions");
questionsDiv.addEventListener("click", handleClick);
let restartButton = document.getElementById("restart");

restartButton.addEventListener("click", () => {
    let newGame = new Jeopardy(6, 5);
    let catDiv = document.querySelector("#categories");
    catDiv.innerHTML = "";
    let questDiv = document.querySelector("#questions");
    questDiv.innerHTML = "";
    newGame.createBoard();
});

