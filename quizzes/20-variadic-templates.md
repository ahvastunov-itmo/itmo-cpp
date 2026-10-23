---
title: "Квиз: Вариативные шаблоны"
description: "Десять вопросов с объяснениями по теме «Вариативные шаблоны»."
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

[Открыть лекцию](../lectures/20-variadic-templates.md){.btn .btn-outline-primary target="_blank"}

:::

::::: {.course-quiz}

<p class="quiz-fallback">Без интерактивной проверки можно пройти вопросы самостоятельно: варианты ответа перечислены под каждым вопросом, разбор открывается по нажатию «Ответ и объяснение».</p>

:::: {.quiz-question data-answer="4"}

## Пакет параметров

Что обозначает `class... Ts` в параметрах шаблона?

::: {.quiz-options}
1. Список значений времени выполнения.
2. Только три типа.
3. Один тип массива.
4. Пакет из нуля или более параметров типа.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Пакет может содержать разное число типов.** Многоточие задаёт вариативность, а не фиксированное число аргументов.

[Повторить: Parameter pack](../lectures/20-variadic-templates.md#parameter-pack){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Число элементов

Что возвращает `sizeof...(Ts)` для пакета типов?

::: {.quiz-options}
1. Сумму `sizeof` всех типов.
2. Всегда размер последнего типа.
3. Размер указателя.
4. Количество элементов пакета.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Количество элементов.** Пустой пакет даёт ноль; это не сумма размеров объектов.

[Повторить: Parameter pack](../lectures/20-variadic-templates.md#parameter-pack){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Разворачивание

В выражении вызова `f(args...)` что означает многоточие?

::: {.quiz-options}
1. Развернуть пакет в список аргументов вызова.
2. Создать всегда один массив.
3. Выполнить `f` бесконечно.
4. Передать адрес пакета как один аргумент.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Каждый элемент пакета становится аргументом.** Разворачивание зависит от шаблонной подстановки, а не от обхода контейнера при запуске.

[Повторить: Parameter pack](../lectures/20-variadic-templates.md#parameter-pack){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Левая свёртка

Для значений `10, 3, 2` чему равна левая унарная свёртка `(... - args)`?

::: {.quiz-options}
1. `-15`.
2. `15`.
3. `9`.
4. `5`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`(10 - 3) - 2 = 5`.** При неассоциативной операции направление свёртки влияет на результат.

[Повторить: Fold-expression (C++17)](../lectures/20-variadic-templates.md#fold-expression-c17){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Правая свёртка

Для значений `10, 3, 2` чему равна правая унарная свёртка `(args - ...)`?

::: {.quiz-options}
1. `15`.
2. `9`.
3. `5`.
4. `-5`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`10 - (3 - 2) = 9`.** Правая свёртка группирует выражения с правого края.

[Повторить: Fold-expression (C++17)](../lectures/20-variadic-templates.md#fold-expression-c17){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Пустая сумма

Какое преимущество у бинарной свёртки `(0 + ... + args)` при пустом пакете целочисленных аргументов?

::: {.quiz-options}
1. Она создаёт один фиктивный элемент пакета.
2. Результат определён и равен `0`.
3. Она возвращает адрес нуля.
4. Она всегда вызывает исключение.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**При пустом пакете остаётся начальное значение `0`.** Унарная свёртка через `+` без начального значения для пустого пакета не определена.

[Повторить: Fold-expression (C++17)](../lectures/20-variadic-templates.md#fold-expression-c17){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## tuple

Что позволяет хранить `std::tuple<int, double, std::string>`?

::: {.quiz-options}
1. Только указатели.
2. Только три одинаковых значения.
3. Три значения разных типов одновременно.
4. Только одно из трёх значений в каждый момент.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Кортеж хранит все перечисленные элементы.** Этим он отличается от `variant`, представляющего одну активную альтернативу.

[Повторить: Tuple](../lectures/20-variadic-templates.md#tuple){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Deduction guide

Для чего нужен deduction guide у шаблона класса?

::: {.quiz-options}
1. Для автоматического удаления всех конструкторов.
2. Для выбора типа во время выполнения.
3. Для задания правила вывода аргументов шаблона из инициализации.
4. Для преобразования всех аргументов в `void*`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Он описывает правило CTAD.** Сам guide не является обычной выполняемой функцией, создающей объект.

[Повторить: Deduction guide](../lectures/20-variadic-templates.md#deduction-guide){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Overload pattern

Что даёт `using Ts::operator()...` в классе, наследующемся от вызываемых типов `Ts...`?

::: {.quiz-options}
1. Удаляет все операторы вызова.
2. Превращает вызовы в виртуальные автоматически.
3. Оставляет только первый вызов.
4. Собирает операторы вызова баз в набор перегрузок.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Объединяет перегрузки `operator()`.** Так из нескольких лямбд получают один объект-посетитель с разными вариантами обработки.

[Повторить: Overload pattern](../lectures/20-variadic-templates.md#overload-pattern){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## visit

Как `std::visit` выбирает обработку одного `std::variant` с активной альтернативой?

::: {.quiz-options}
1. Преобразует значение в строку независимо от посетителя.
2. Вызывает все альтернативы одновременно.
3. Всегда выбирает первый тип списка.
4. Вызывает посетителя с текущей активной альтернативой.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Посетителю передаётся активная альтернатива.** Он должен быть корректно вызываем для всех возможных альтернатив; состояние `valueless_by_exception` требует отдельного учёта.

[Повторить: std::visit](../lectures/20-variadic-templates.md#stdvisit){target="_blank"}

</details>

::::

:::::
