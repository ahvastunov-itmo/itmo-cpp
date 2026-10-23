---
title: "Квиз: Шаблонное метапрограммирование"
description: "Десять вопросов с объяснениями по теме «Шаблонное метапрограммирование»."
page-navigation: false
toc: false
format:
  html:
    css:
      - ../styles.css
      - ../assets/quizzes/quiz.css
    include-after-body:
      text: |
        <script src="../assets/quizzes/quiz.js" defer></script>
---

::: {.quiz-intro}

**C++20 · 10 вопросов · около 10 минут**

Выберите ответ и проверьте себя. После каждого вопроса появится объяснение, в конце — результат и полный разбор. В вопросах с несколькими ответами нужно выбрать все верные варианты: за каждый полностью верный ответ начисляется один балл.

[Открыть лекцию](../lectures/21-template-metaprogramming.md){.btn .btn-outline-primary target="_blank"}

:::

::::: {.course-quiz}

<p class="quiz-fallback">Без интерактивной проверки можно пройти вопросы самостоятельно: варианты ответа перечислены под каждым вопросом, разбор открывается по нажатию «Ответ и объяснение».</p>

:::: {.quiz-question data-answer="2"}

## constexpr-функция

Обязан ли каждый вызов `constexpr`-функции вычисляться при компиляции?

::: {.quiz-options}
1. Да, если имя короткое.
2. Нет, она может вызываться и во время выполнения.
3. Да, независимо от аргументов.
4. Нет, `constexpr` вообще запрещает константные выражения.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Возможен обычный вызов во время выполнения.** Компиляционное вычисление зависит от контекста и допустимости константного выражения.

[Повторить: constexpr](../lectures/21-template-metaprogramming.md#constexpr){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Проверка типа

Что даёт `std::is_same_v<int, const int>`?

::: {.quiz-options}
1. `true`.
2. `false`.
3. Ошибку, потому что сравнивать типы нельзя.
4. Тип `int`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`false`: это разные типы.** Квалификатор `const` учитывается; если его нужно игнорировать, сначала применяют соответствующее преобразование типа.

[Повторить: is_same (naive)](../lectures/21-template-metaprogramming.md#is_same-naive){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Суффиксы traits

Каково обычное значение суффиксов `_t` и `_v` в type traits?

::: {.quiz-options}
1. Оба означают указатель.
2. `_t` — вспомогательный тип, `_v` — вспомогательная переменная-значение.
3. `_t` — поток, `_v` — виртуальный метод.
4. Оба означают функцию с побочным эффектом.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Это соглашение о типе и значении результата.** Оно сокращает запись вроде `typename trait<T>::type` и `trait<T>::value`.

[Повторить: Helper variables/types](../lectures/21-template-metaprogramming.md#helper-variablestypes){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Снятие cv

Чему равен `std::remove_cv_t<const volatile int>`?

::: {.quiz-options}
1. `const int`.
2. `int`.
3. `int*`.
4. `volatile int`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`int`.** `remove_cv` убирает верхнеуровневые `const` и `volatile`, а не выполняет преобразование объекта во время выполнения.

[Повторить: std::remove_cv](../lectures/21-template-metaprogramming.md#stdremove_cv){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Указатель или ссылка

Каково значение `std::is_pointer_v<int&>`?

::: {.quiz-options}
1. Равно размеру адреса.
2. `false`, ссылка и указатель — разные категории типов.
3. Зависит от значения объекта.
4. `true`, любая ссылка — указатель.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`false`.** Возможная реализация ссылки через адрес не делает её указательным типом в системе типов языка.

[Повторить: is_pointer (Primary type categories)](../lectures/21-template-metaprogramming.md#is_pointer-primary-type-categories){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## SFINAE

При выводе аргументов шаблона функции подстановка даёт недопустимый тип в непосредственном контексте объявления. Как обычно действует SFINAE?

::: {.quiz-options}
1. Такой кандидат исключается из набора для выбора перегрузки.
2. Все ошибки в любом теле функции молча игнорируются.
3. Функция автоматически возвращает ноль.
4. Программа обязательно запускается с ошибкой времени выполнения.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Кандидат отбрасывается.** SFINAE не превращает произвольные ошибки в теле выбранной функции в допустимый код.

[Повторить: SFINAE](../lectures/21-template-metaprogramming.md#sfinae){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## enable_if

Что происходит с `std::enable_if_t<false, int>` в подходящем контексте подстановки?

::: {.quiz-options}
1. Соответствующего типа нет, что может убрать кандидата через SFINAE.
2. Получается `bool`.
3. Создаётся значение `0`.
4. Получается `int`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Тип не определён при ложном условии.** Именно это свойство используют для условного участия шаблона в выборе перегрузки.

[Повторить: std::enable_if (C++ 11)](../lectures/21-template-metaprogramming.md#stdenable_if-c-11){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## if constexpr

Зачем использовать `if constexpr` внутри шаблона?

::: {.quiz-options}
1. Чтобы выбирать ветвь по константному условию и не инстанцировать отброшенную зависимую ветвь.
2. Чтобы любое условие вычислялось на другом потоке.
3. Чтобы отключить синтаксический разбор программы.
4. Чтобы все ветви всегда выполнялись.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Выбор происходит при инстанцировании по константному условию.** Это не разрешает произвольный синтаксически неверный код в отброшенной ветви.

[Повторить: if constexpr](../lectures/21-template-metaprogramming.md#if-constexpr){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Концепты

Что задаёт concept в C++20?

::: {.quiz-options}
1. Любую динамическую проверку ввода.
2. Обязательный класс с виртуальным деструктором.
3. Только комментарий для читателя.
4. Проверяемое при компиляции ограничение для аргументов шаблона.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Ограничение на шаблонные аргументы.** Оно выражает требования к типам и операциям и участвует в допустимости шаблонных специализаций и перегрузок.

[Повторить: Concepts (C++20)](../lectures/21-template-metaprogramming.md#concepts-c20){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1 2 3"}

## Виды requirements

Какие требования можно выразить в `requires`-выражении? Выберите все верные варианты.

::: {.quiz-options}
1. Корректность выражения.
2. Наличие вложенного типа.
3. Условие о типе результата и `noexcept` для выражения.
4. Изменение переменной при проверке требования во время выполнения.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Первые три варианта.** Simple, type и compound requirements проверяют свойства на этапе компиляции; проверяемые выражения не выполняются ради этой проверки.

[Повторить: requirements](../lectures/21-template-metaprogramming.md#requirements){target="_blank"}

</details>

::::

:::::
