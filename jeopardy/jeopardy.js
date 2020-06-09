// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let categoryIds = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const response = await axios.get(`http://jservice.io/api/categories`,{params:{count: 100}});
    for (i=0;i<6;i++){
        let index = Math.floor(Math.random()*100)
        categoryIds.push(response.data[index])
    }
} 

getCategoryIds();

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
**/

async function getCategory(catId) {
    let response = await axios.get(`http://jservice.io/api/category`,{params:{id: catId}})
    let category = {};
    category.title = response.data.title;
    category.clues = response.data.clues;
    for (clue of category.clues){
        clue.showing = null;
    }
    category.id = response.data.id;
    return category
}

async function buildCategories(ids){
    console.log("HELLO");
    for (id of ids){
        let response = await getCategory(id.id);
       categories.push(response)
    }
    console.log(categories);
}


buildCategories(categoryIds);





/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const jeopardyTable =document.querySelector('#jeopardy');
    const top = document.createElement("tr")
    top.setAttribute("id","column-top");

    for (let x=0; x<6; x++){
        const headCell = document.createElement("td");
        headCell.innerText = categories[x].title
        headCell.setAttribute("id",x);
        top.append(headCell)
    }
    jeopardyTable.append(top);
    for (let y = 0;y<5;y++){
        const row = document.createElement("tr");
        for (let x = 0; x<6 ;x++){
            const cell = document.createElement("td");
            cell.setAttribute("id",`${y}-${x}`);
            cell.classList.add("question")
            cell.innerText = "?"
            //cell.innerText = categories[x].clues[y].question
            row.append(cell);
        }
        jeopardyTable.append(row);
    }
}



function handleClick(evt) {
}
$(".question").on("click",function(){
    alert("HELLO");
});

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
