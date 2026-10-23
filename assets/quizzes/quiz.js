(() => {
    'use strict';

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function initQuiz(root, quizIndex) {
        const questions = [...root.querySelectorAll('.quiz-question')].map((node, index) => {
            const answers = (node.dataset.answer || '').trim().split(/\s+/).map(Number);
            const choices = [...node.querySelectorAll('.quiz-options > ol > li')];
            return {
                node, index, answers, choices,
                heading: node.querySelector('h2'),
                options: node.querySelector('.quiz-options'),
                explanation: node.querySelector('.quiz-explanation'),
                selected: null,
                correct: false,
            };
        });

        // Keep the readable, non-interactive version if an authored question is incomplete.
        if (!questions.length || questions.some(q => !q.heading || !q.explanation
            || !q.choices.length || new Set(q.answers).size !== q.answers.length
            || q.answers.some(n => !Number.isInteger(n) || n < 1 || n > q.choices.length))) return;

        let current = 0;
        const meter = element('div', 'quiz-progress');
        const progressText = element('p', 'quiz-progress-text');
        const progress = element('progress');
        progress.max = questions.length;
        progress.setAttribute('aria-label', 'Количество проверенных ответов');
        meter.append(progressText, progress);
        root.prepend(meter);

        const result = element('section', 'quiz-result');
        result.hidden = true;
        root.append(result);

        function updateProgress() {
            const answered = questions.filter(q => q.selected !== null).length;
            progress.value = answered;
            progressText.textContent = `Вопрос ${current + 1} из ${questions.length} · Проверено ${answered}`;
        }

        function showQuestion(index, focus = true) {
            current = index;
            questions.forEach(q => { q.node.hidden = q.index !== current; });
            updateProgress();
            if (focus) questions[index].heading.focus();
        }

        function showResult() {
            questions.forEach(q => { q.node.hidden = true; });
            const score = questions.filter(q => q.correct).length;
            progressText.textContent = 'Все вопросы пройдены';
            const heading = element('h2', 'quiz-result-heading', `Верно ${score} из ${questions.length}`);
            heading.tabIndex = -1;
            const message = element('p', '', score === questions.length
                ? 'Все ответы верны. Ниже можно ещё раз просмотреть объяснения.'
                : 'Раскройте разборы, чтобы сравнить свои ответы с верными и повторить материал.');
            const restart = element('button', 'btn btn-primary quiz-restart', 'Пройти заново');
            restart.type = 'button';
            restart.addEventListener('click', reset);
            result.replaceChildren(heading, message, restart);

            const review = element('div', 'quiz-review');
            questions.forEach(q => {
                const detail = element('details', 'quiz-review-item');
                detail.dataset.correct = String(q.correct);
                const summary = element('summary', '', `${q.index + 1}. ${q.heading.textContent.trim()} — ${q.correct ? 'верно' : 'есть ошибка'}`);
                const selected = element('p', 'quiz-selected-answer', `Ваш ответ: ${q.selected.map(n => q.choices[n - 1].textContent.trim()).join('; ')}`);
                detail.append(summary, selected);
                [...q.explanation.children].filter(node => node.tagName !== 'SUMMARY').forEach(node => {
                    const clone = node.cloneNode(true);
                    clone.removeAttribute('id');
                    clone.querySelectorAll('[id]').forEach(child => child.removeAttribute('id'));
                    detail.append(clone);
                });
                review.append(detail);
            });
            result.append(review);
            result.hidden = false;
            heading.focus();
        }

        function reset() {
            result.hidden = true;
            result.replaceChildren();
            questions.forEach(q => {
                q.selected = null;
                q.correct = false;
                q.form.reset();
                q.fieldset.disabled = false;
                q.check.hidden = false;
                q.next.hidden = true;
                q.feedback.hidden = true;
                q.feedback.textContent = '';
                q.error.hidden = true;
                q.explanation.hidden = true;
                q.explanation.open = false;
                q.labels.forEach(label => {
                    label.classList.remove('is-correct', 'is-incorrect');
                    label.querySelector('.quiz-option-result')?.remove();
                });
            });
            showQuestion(0);
        }

        questions.forEach(q => {
            q.heading.tabIndex = -1;
            if (!q.heading.id) q.heading.id = `quiz-${quizIndex}-question-${q.index}`;
            q.form = element('form', 'quiz-form');
            q.form.noValidate = true;
            q.form.setAttribute('aria-labelledby', q.heading.id);
            q.fieldset = element('fieldset', 'quiz-answers');
            q.fieldset.append(element('legend', '', q.answers.length > 1 ? 'Выберите все верные варианты' : 'Выберите один ответ'));
            q.labels = q.choices.map((choice, index) => {
                const label = element('label', 'quiz-option');
                const input = element('input');
                input.type = q.answers.length > 1 ? 'checkbox' : 'radio';
                input.name = `quiz-${quizIndex}-question-${q.index}`;
                input.value = index + 1;
                const content = element('span', 'quiz-option-content');
                [...choice.childNodes].forEach(node => content.append(node.cloneNode(true)));
                label.append(input, content);
                q.fieldset.append(label);
                return label;
            });
            q.error = element('p', 'quiz-error', 'Сначала выберите ответ.');
            q.error.setAttribute('role', 'alert');
            q.error.hidden = true;
            q.check = element('button', 'btn btn-primary quiz-check', 'Проверить ответ');
            q.check.type = 'submit';
            q.feedback = element('p', 'quiz-feedback');
            q.feedback.setAttribute('role', 'status');
            q.feedback.hidden = true;
            q.next = element('button', 'btn btn-primary quiz-next', q.index === questions.length - 1 ? 'Посмотреть результат' : 'Следующий вопрос');
            q.next.type = 'button';
            q.next.hidden = true;
            q.explanation.hidden = true;
            q.form.append(q.fieldset, q.error, q.check, q.feedback, q.explanation, q.next);
            q.options.replaceWith(q.form);
            q.form.addEventListener('change', () => { q.error.hidden = true; });
            q.form.addEventListener('submit', event => {
                event.preventDefault();
                if (q.index !== current || q.selected !== null) return;
                const selected = [...q.form.querySelectorAll('input:checked')].map(input => Number(input.value));
                if (!selected.length) {
                    q.error.hidden = false;
                    q.form.querySelector('input').focus();
                    return;
                }
                q.selected = selected;
                q.correct = selected.length === q.answers.length && selected.every(n => q.answers.includes(n));
                q.error.hidden = true;
                q.fieldset.disabled = true;
                q.check.hidden = true;
                q.feedback.textContent = q.correct ? 'Верно!' : 'Пока неверно. Сравните ответ с объяснением.';
                q.feedback.dataset.correct = String(q.correct);
                q.feedback.hidden = false;
                q.explanation.hidden = false;
                q.explanation.open = true;
                q.next.hidden = false;
                q.labels.forEach((label, index) => {
                    const right = q.answers.includes(index + 1);
                    const chosen = selected.includes(index + 1);
                    label.classList.toggle('is-correct', right);
                    label.classList.toggle('is-incorrect', chosen && !right);
                    if (right || chosen) label.append(element('span', 'quiz-option-result', chosen
                        ? `Ваш ответ · ${right ? 'верно' : 'неверно'}` : 'Верный ответ'));
                });
                updateProgress();
                q.next.focus();
            });
            q.next.addEventListener('click', () => {
                if (q.index !== current || q.selected === null) return;
                if (current === questions.length - 1) showResult();
                else showQuestion(current + 1);
            });
        });

        root.querySelector('.quiz-fallback')?.setAttribute('hidden', '');
        root.classList.add('is-interactive');
        showQuestion(0, false);
    }

    document.querySelectorAll('.course-quiz').forEach(initQuiz);
})();
