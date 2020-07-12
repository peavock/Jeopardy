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
let startCounter = 0;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
	const response = await axios.get(`http://jservice.io/api/categories`, {
		params: { count: 100 }
	});
	for (i = 0; i < 6; i++) {
		let index = Math.floor(Math.random() * 100);
		while (categoryIds.includes(response.data[index])) {
			index = Math.floor(Math.random() * 100);
		}
		categoryIds.push(response.data[index]);
	}
}

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
	console.log(catId);
	let response = await axios.get(`http://jservice.io/api/category`, {
		params: { id: catId }
	});
	let category = {};
	category.title = response.data.title;
	category.clues = response.data.clues;
	for (clue of category.clues) {
		clue.showing = null;
	}
	category.id = response.data.id;
	return category;
}

async function buildCategories(ids) {
	for (id of ids) {
		let response = await getCategory(id.id);
		categories.push(response);
	}
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
	const jeopardyTable = document.querySelector('#jeopardy');
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');

	for (let x = 0; x < 6; x++) {
		const headCell = document.createElement('td');
		headCell.innerText = categories[x].title.toUpperCase();
		top.append(headCell);
	}
	jeopardyTable.append(top);

	for (let y = 0; y < 5; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < 6; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${x}-${y}`);
			cell.addEventListener('click', handleClick);

			cell.innerHTML = '<i class="fas fa-question-circle fa-2x"></i>';
			//cell.innerText = categories[x].clues[y].question
			row.append(cell);
		}
		jeopardyTable.append(row);
	}
}

function handleClick(evt) {
	let cellUse = evt.target.closest('td');
	let x = cellUse.id.substring(0, 1);
	let y = cellUse.id.substring(2, 3);
	let question = $(`#${x}-${y}`);
	if (question.hasClass('showing')) {
		question.text(categories[x].clues[y].answer);
		question.addClass('answered');
	} else {
		question.text(categories[x].clues[y].question);
		question.addClass('showing');
	}
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

async function showLoad() {
	let gameSpace = document.getElementById('game');
	gameSpace.innerHTML =
		'<i class="fa fa-spinner fa-spin fa-6x text-primary" aria-hidden-"true"></i>';
	$('button')
		.eq(0)
		.text('Loading...');

	await getCategoryIds();

	setTimeout(function() {
		buildCategories(categoryIds);
		$('button')
			.eq(0)
			.text('Restart!');
		gameSpace.innerHTML = '<div id="jeopardy" class="container"></div>';
	}, 2000);
	setTimeout(function() {
		fillTable();
	}, 6000);
}

/** Remove the loading spinner and update the button used to fetch data. */

function restartPage() {
	$('button')
		.eq(0)
		.text('Start!');
	let gameSpace = document.getElementById('game');
	gameSpace.innerHTML = '';
	categoryIds = [];
	categories = [];
}

/** On click of start / restart button, set up game. */
$('#start').on('click', function() {
	startCounter === 0 ? showLoad() : restartPage();
	startCounter === 0 ? (startCounter = 1) : (startCounter = 0);
});
// TODO

/** On page load, add event handler for clicking clues */

// TODO
