const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {JSDOM} = require('jsdom');

const root = join(__dirname, '..');
const html = readFileSync(join(root, '_site/quizzes/01-types-operators.html'), 'utf8');
const script = readFileSync(join(root, 'assets/quizzes/quiz.js'), 'utf8');
// Independent answer key: catches accidental changes to authored data-answer values too.
const correctAnswers = [[1, 4], [3], [2], [2], [3], [4], [1, 4], [2], [4], [1]];

function page(interactive = true) {
    const dom = new JSDOM(html, {runScripts: 'outside-only', url: 'https://example.test/itmo-cpp/quizzes/01-types-operators.html'});
    if (interactive) dom.window.eval(script);
    const document = dom.window.document;
    return {dom, document, quiz: document.querySelector('.course-quiz')};
}

function active(quiz) {
    return [...quiz.querySelectorAll('.quiz-question')].find(node => !node.hidden);
}

function answer(question, values) {
    question.querySelectorAll('input').forEach(input => { input.checked = values.includes(Number(input.value)); });
    question.querySelector('.quiz-check').click();
}

function complete(quiz, responses) {
    responses.forEach(values => {
        const question = active(quiz);
        assert.ok(question);
        answer(question, values);
        question.querySelector('.quiz-next').click();
    });
}

test('without JavaScript all questions, options and expandable explanations remain readable', () => {
    const {quiz} = page(false);
    const questions = [...quiz.querySelectorAll('.quiz-question')];
    assert.equal(questions.length, 10);
    for (const question of questions) {
        assert.equal(question.hidden, false);
        assert.equal(question.querySelectorAll('.quiz-options > ol > li').length, 4);
        assert.ok(question.querySelector('details.quiz-explanation > summary'));
        assert.ok(question.querySelector('.quiz-explanation a[href*="lectures/"]'));
    }
    assert.ok(quiz.textContent.includes('integer-literals.cpp'));
    assert.ok(quiz.textContent.includes('type-conversions.cpp'));
});

test('an empty answer does not advance or reveal the solution', () => {
    const {quiz, document} = page();
    assert.equal(quiz.querySelectorAll('.quiz-question:not([hidden])').length, 1);
    const question = active(quiz);
    question.querySelector('.quiz-check').click();
    assert.equal(question.querySelector('.quiz-error').hidden, false);
    assert.equal(question.querySelector('.quiz-explanation').hidden, true);
    assert.equal(question.querySelector('.quiz-next').hidden, true);
    assert.equal(quiz.querySelector('progress').value, 0);
    assert.equal(document.activeElement, question.querySelector('input'));
});

test('multiple choice requires the exact set; partial and extra choices fail', () => {
    for (const [values, expected] of [[[1], false], [[1, 2, 4], false], [[1, 4], true]]) {
        const {quiz} = page();
        const question = active(quiz);
        assert.equal(question.querySelectorAll('input[type="checkbox"]').length, 4);
        answer(question, values);
        assert.equal(question.querySelector('.quiz-feedback').dataset.correct, String(expected));
        assert.equal(question.querySelectorAll('.quiz-option.is-correct').length, 2);
        assert.equal(question.querySelector('.quiz-explanation').open, true);
        assert.equal(question.querySelector('fieldset').disabled, true);
        // Duplicate submit must not add another answer or change the first result.
        question.querySelector('form').dispatchEvent(new question.ownerDocument.defaultView.Event('submit', {cancelable: true}));
        assert.equal(quiz.querySelector('progress').value, 1);
        question.querySelector('.quiz-next').click();
        assert.equal(active(quiz).querySelectorAll('input[type="radio"]').length, 4);
    }
});

test('a complete correct attempt yields 10/10 and a review of all answers', () => {
    const {quiz, document} = page();
    complete(quiz, correctAnswers);
    assert.equal(active(quiz), undefined);
    assert.equal(quiz.querySelector('.quiz-result').hidden, false);
    assert.equal(quiz.querySelector('.quiz-result-heading').textContent, 'Верно 10 из 10');
    assert.equal(quiz.querySelectorAll('.quiz-review-item[data-correct="true"]').length, 10);
    assert.equal(quiz.querySelector('progress').value, 10);
    assert.equal(document.activeElement, quiz.querySelector('.quiz-result-heading'));
});

test('a mixed attempt records mistakes and a retry clears choices, score and feedback', () => {
    const {quiz} = page();
    const answers = correctAnswers.map(values => [...values]);
    answers[0] = [1];
    answers[2] = [1];
    complete(quiz, answers);
    assert.equal(quiz.querySelector('.quiz-result-heading').textContent, 'Верно 8 из 10');
    assert.equal(quiz.querySelectorAll('.quiz-review-item[data-correct="false"]').length, 2);
    assert.ok(quiz.querySelector('.quiz-selected-answer').textContent.includes('student_count'));
    quiz.querySelector('.quiz-restart').click();
    assert.equal(quiz.querySelector('.quiz-result').hidden, true);
    assert.equal(quiz.querySelector('progress').value, 0);
    assert.equal(quiz.querySelectorAll('input:checked, fieldset:disabled, .quiz-option-result').length, 0);
    assert.equal(quiz.querySelectorAll('.quiz-feedback:not([hidden]), .quiz-explanation:not([hidden])').length, 0);
    assert.equal(active(quiz), quiz.querySelector('.quiz-question'));
    complete(quiz, correctAnswers);
    assert.equal(quiz.querySelector('.quiz-result-heading').textContent, 'Верно 10 из 10');
});

test('all wrong answers yield zero without skipping the final explanation', () => {
    const {quiz} = page();
    const wrong = correctAnswers.map(values => [[1, 2, 3, 4].find(value => !values.includes(value))]);
    complete(quiz, wrong);
    assert.equal(quiz.querySelector('.quiz-result-heading').textContent, 'Верно 0 из 10');
    assert.equal(quiz.querySelectorAll('.quiz-review-item[data-correct="false"]').length, 10);
});
