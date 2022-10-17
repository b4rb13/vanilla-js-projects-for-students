const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal'),
  areaSelect = document.getElementById('area');

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  areaSelect.value = ''

  // Clear single meal
  single_mealEl.innerHTML = '';
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          renderMealsList(data)
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      console.log(data, 'random')
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

function renderMealsList(data) {
  mealsEl.innerHTML = data.meals
    .map(
      meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
    )
    .join('');
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderAreaList() {
  fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    .then(response => response.json())
    .then(areas => {
      areaSelect.innerHTML += createOptions(areas.meals)
    })
}

function createOptions(areas) {
  return areas.reduce((acc, curr) => acc += `
        <option value="${curr.strArea}">${curr.strArea}</option>
      `, '')
}

function getMealsByArea(){
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaSelect.value}`)
    .then(res => res.json())
    .then(res => renderMealsList(res))
}

// Event listeners
document.addEventListener('DOMContentLoaded',() => {
  renderAreaList()
})
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
areaSelect.addEventListener('change', getMealsByArea)

mealsEl.addEventListener('click', e => {

  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.dataset.mealid;
    getMealById(mealID);
  }
});
