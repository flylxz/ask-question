export class Question {
  static create(question) {
    return fetch('https://ask-a-question-c3b45.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      header: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList);
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve('<p class="error">Token abscense</p>');
    }
    return fetch(
      `https://ask-a-question-c3b45.firebaseio.com/questions.json?auth=${token}`
    )
      .then(response => response.json())
      .then(response => {
        if (response && response.error) {
          return `<p class="error">${response.error}/p>`;
        }

        return response
          ? Object.keys(response).map(key => ({
              ...response[key],
              id: key
            }))
          : [];
      });
  }

  static renderList() {
    const questions = getQuestionFromLocalStorage();

    const html = questions.length
      ? questions.map(toCard).join('')
      : "<div class='mui--text-headline'>You didn't ask anything</div>";

    const list = document.getElementById('list');
    list.innerHTML = html;
  }

  static listToHTML(question) {
    return question.length
      ? `<ol>${question
          .map(question => `<li>${question.text}</li>`)
          .join('')}</ol>`
      : `<p>Empty list</p>`;
  }
}

function addToLocalStorage(question) {
  const all = getQuestionFromLocalStorage();
  all.push(question);
  localStorage.setItem('questions', JSON.stringify(all));
}

function getQuestionFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toCard(question) {
  return `
    <div class="mui--text-black-54">    
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>${question.text}</div>
    <br />
    `;
}
