const {readFileSync, readdirSync, existsSync} = require('node:fs');
const {join, relative} = require('node:path');
const {fileURLToPath, pathToFileURL} = require('node:url');
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {JSDOM} = require('jsdom');

const root = join(__dirname, '..');
const site = join(root, '_site');
const script = readFileSync(join(root, 'assets/quizzes/quiz.js'), 'utf8');
const lectures = readdirSync(join(root, 'lectures')).filter(name => name.endsWith('.md')).sort();
const quizzes = readdirSync(join(root, 'quizzes')).filter(name => name.endsWith('.md') && name !== 'index.md').sort();
const readPage = path => new JSDOM(readFileSync(path, 'utf8'), {
    runScripts: 'outside-only', url: pathToFileURL(path).href,
});
const ids = new Map();

function verifyLink(link) {
    const url = new URL(link.href);
    assert.equal(url.protocol, 'file:');
    const path = fileURLToPath(url);
    assert.ok(relative(site, path) && !relative(site, path).startsWith('..'), path);
    assert.ok(existsSync(path), `Missing target: ${path}`);
    if (!url.hash) return;
    if (!ids.has(path)) {
        const dom = readPage(path);
        ids.set(path, new Set([...dom.window.document.querySelectorAll('[id]')].map(node => node.id)));
        dom.window.close();
    }
    assert.ok(ids.get(path).has(decodeURIComponent(url.hash.slice(1))), `Missing section: ${url.href}`);
}

function complete(quiz, responses) {
    for (const response of responses) {
        const question = quiz.querySelector('.quiz-question:not([hidden])');
        assert.ok(question, 'Exactly one question remains available');
        for (const input of question.querySelectorAll('input')) input.checked = response.includes(Number(input.value));
        question.querySelector('.quiz-check').click();
        assert.equal(question.querySelector('.quiz-explanation').hidden, false);
        assert.equal(question.querySelector('.quiz-explanation').open, true);
        question.querySelector('.quiz-next').click();
    }
}

test('every lecture has a quiz linked from the lecture, homepage, catalog and quiz sidebar', () => {
    assert.deepEqual(quizzes, lectures);
    const home = readPage(join(site, 'index.html'));
    const catalog = readPage(join(site, 'quizzes/index.html'));
    try {
        for (const filename of lectures) {
            const name = filename.replace(/\.md$/, '.html');
            const lecture = readPage(join(site, 'lectures', name));
            try {
                const link = lecture.window.document.querySelector(`main a[href$="/quizzes/${name}"]`);
                assert.ok(link, `Lecture must link to its quiz: ${name}`);
                verifyLink(link);
                assert.ok(home.window.document.querySelector(`main a[href$="quizzes/${name}"]`), name);
                assert.ok(catalog.window.document.querySelector(`main a[href$="${name}"]:not([href*="lectures/"])`), name);
                assert.ok(catalog.window.document.querySelector(`#quarto-sidebar a[href$="${name}"]`), name);
            } finally {
                lecture.window.close();
            }
        }
    } finally {
        home.window.close();
        catalog.window.close();
    }
});

for (const filename of quizzes) {
    const name = filename.replace(/\.md$/, '.html');
    test(`${filename}: readable questions, valid section links, complete scoring and retry`, () => {
        const dom = readPage(join(site, 'quizzes', name));
        try {
            const document = dom.window.document;
            const quiz = document.querySelector('.course-quiz');
            const questions = [...quiz.querySelectorAll('.quiz-question')];
            assert.equal(questions.length, 10);
            const headings = questions.map(q => q.querySelector('h2')?.textContent.trim());
            assert.equal(new Set(headings).size, 10);
            assert.ok(headings.every(Boolean));
            const answers = questions.map(question => {
                assert.equal(question.hidden, false);
                const choices = [...question.querySelectorAll('.quiz-options > ol > li')];
                assert.equal(choices.length, 4);
                assert.equal(new Set(choices.map(c => c.textContent.trim())).size, 4);
                const key = question.dataset.answer.split(/\s+/).map(Number);
                assert.ok(key.length > 0 && key.length < choices.length);
                assert.equal(new Set(key).size, key.length);
                assert.ok(key.every(i => Number.isInteger(i) && i >= 1 && i <= choices.length));
                if (key.length > 1) assert.match(question.textContent, /Выберите все верные варианты/);
                const explanation = question.querySelector('details.quiz-explanation');
                assert.ok(explanation.querySelector('summary'));
                assert.ok(explanation.textContent.length > 100);
                const links = [...explanation.querySelectorAll('a[href*="lectures/"]')];
                assert.ok(links.length > 0);
                for (const link of links) {
                    assert.ok(link.getAttribute('href').includes(`/lectures/${name}#`), link.href);
                    verifyLink(link);
                }
                return key;
            });
            dom.window.eval(script);
            assert.equal(quiz.querySelectorAll('.quiz-question:not([hidden])').length, 1);
            complete(quiz, answers);
            assert.equal(quiz.querySelector('.quiz-result-heading').textContent, 'Верно 10 из 10');
            assert.equal(quiz.querySelectorAll('.quiz-review-item[data-correct="true"]').length, 10);
            quiz.querySelector('.quiz-restart').click();
            assert.equal(quiz.querySelector('progress').value, 0);
            assert.equal(quiz.querySelectorAll('input:checked, fieldset:disabled').length, 0);
            const wrong = answers.map(key => [[1, 2, 3, 4].find(index => !key.includes(index))]);
            complete(quiz, wrong);
            assert.equal(quiz.querySelector('.quiz-result-heading').textContent, 'Верно 0 из 10');
            assert.equal(quiz.querySelectorAll('.quiz-review-item[data-correct="false"]').length, 10);
        } finally {
            dom.window.close();
        }
    });
}

test('an invalid authored answer preserves the readable fallback for the whole quiz', () => {
    const dom = readPage(join(site, 'quizzes/01-types-operators.html'));
    try {
        const quiz = dom.window.document.querySelector('.course-quiz');
        quiz.querySelector('.quiz-question').dataset.answer = '99';
        dom.window.eval(script);
        assert.equal(quiz.querySelectorAll('.quiz-form').length, 0);
        assert.equal(quiz.querySelectorAll('.quiz-question:not([hidden])').length, 10);
        assert.equal(quiz.querySelectorAll('details.quiz-explanation').length, 10);
    } finally {
        dom.window.close();
    }
});
