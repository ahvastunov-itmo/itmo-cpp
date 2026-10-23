---
title: "Квиз: Шаблоны классов и функций — I"
description: "Десять вопросов с объяснениями по теме «Шаблоны классов и функций — I»."
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

[Открыть лекцию](../lectures/12-templates-classes-functions.md){.btn .btn-outline-primary target="_blank"}

:::

::::: {.course-quiz}

<p class="quiz-fallback">Без интерактивной проверки можно пройти вопросы самостоятельно: варианты ответа перечислены под каждым вопросом, разбор открывается по нажатию «Ответ и объяснение».</p>

:::: {.quiz-question data-answer="1"}

## Задача шаблона

Что описывает шаблон функции?

::: {.quiz-options}
1. Семейство функций, параметризованное аргументами шаблона.
2. Текстовый макрос без правил типов.
3. Только виртуальную функцию.
4. Единственную функцию с проверкой типов только при запуске.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Семейство функций.** Конкретные аргументы шаблона позволяют получить специализацию с конкретными типами и поведением.

[Повторить: Шаблоны](../lectures/12-templates-classes-functions.md#шаблоны){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Параметр типа

В объявлении `template<class T>` что такое `T`?

::: {.quiz-options}
1. Ключевое слово для потока.
2. Имя пространства имён.
3. Параметр шаблона, обозначающий тип.
4. Всегда переменная типа `int`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Параметр типа.** В этом контексте `class` и `typename` вводят параметр типа и не ограничивают его только классами.

[Повторить: Шаблоны функций](../lectures/12-templates-classes-functions.md#шаблоны-функций){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Вывод типа

У шаблона `template<class T> T max_value(T, T)` вызывается `max_value(2, 5)`. Какой `T` выводится?

::: {.quiz-options}
1. `double`.
2. `void`.
3. `int*`.
4. `int`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`int`.** Оба аргумента имеют этот тип и дают согласованный результат вывода.

[Повторить: Template argument deduction](../lectures/12-templates-classes-functions.md#template-argument-deduction){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Несогласованные аргументы

Для `template<class T> T max_value(T, T)` вызывается `max_value(2, 5.0)` без других перегрузок. Что происходит?

::: {.quiz-options}
1. Вывод не удаётся: аргументы дают разные типы `T`.
2. `T` всегда становится `int`.
3. Тип выбирается по большему значению.
4. `T` всегда становится `double`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Получаются конфликтующие `int` и `double`.** Вывод общего `T` для такой сигнатуры не выполняет автоматический поиск общего арифметического типа.

[Повторить: Template argument deduction](../lectures/12-templates-classes-functions.md#template-argument-deduction){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Явный аргумент шаблона

Как явно выбрать `double` для `T` в вызове `max_value`?

::: {.quiz-options}
1. `max_value(double)(2, 5)`.
2. `max_value<double>(2, 5)`.
3. `double::max_value(2, 5)`.
4. `max_value[double](2, 5)`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`max_value<double>(2, 5)`.** Тип задан явно, поэтому аргументы обычного вызова могут быть преобразованы к параметрам `double`.

[Повторить: Шаблоны функций](../lectures/12-templates-classes-functions.md#шаблоны-функций){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Инстанцирование

Что означает инстанцирование шаблона?

::: {.quiz-options}
1. Получение конкретной специализации из шаблона с выбранными аргументами.
2. Автоматическое создание виртуальной таблицы.
3. Удаление исходного определения.
4. Запуск всех возможных типов программы.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Создаётся конкретная специализация.** Например, из общего шаблона получается вариант для `int`; это работа времени компиляции.

[Повторить: Инстанциация](../lectures/12-templates-classes-functions.md#инстанциация){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Определение в заголовке

Почему определение шаблона обычно размещают в заголовке?

::: {.quiz-options}
1. Потому что `.cpp` запрещены языком.
2. Чтобы отключить линкер.
3. Чтобы все специализации обязательно выполнялись одновременно.
4. Оно обычно должно быть доступно там, где требуется неявное инстанцирование.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Компилятору нужно видеть определение при инстанцировании.** Существуют схемы с явным инстанцированием, но для общего шаблонного интерфейса обычен заголовок.

[Повторить: Инстанциация](../lectures/12-templates-classes-functions.md#инстанциация){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Разные специализации класса

Как соотносятся `Box<int>` и `Box<double>` для шаблона класса `Box`?

::: {.quiz-options}
1. Это всегда один и тот же тип.
2. Это разные типы.
3. Оба обязательно имеют одинаковый размер.
4. Второй автоматически наследуется от первого.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Разные специализации являются разными типами.** Между ними нет автоматического наследования или преобразования без специально заданного интерфейса.

[Повторить: Шаблон класса](../lectures/12-templates-classes-functions.md#шаблон-класса){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## CTAD

Что позволяет class template argument deduction?

::: {.quiz-options}
1. Менять тип объекта при каждом присваивании.
2. В подходящих случаях выводить аргументы шаблона класса из инициализации.
3. Всегда пропускать все аргументы любого шаблона.
4. Выбирать аргументы шаблона только по имени переменной.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**CTAD выводит аргументы по инициализации и правилам вывода.** Он работает не для любой произвольной конструкции.

[Повторить: Class template argument deduction (CTAD)](../lectures/12-templates-classes-functions.md#class-template-argument-deduction-ctad){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Нетиповой параметр

В `std::array<int, 4>` что представляет собой `4`?

::: {.quiz-options}
1. Индекс текущего элемента.
2. Имя типа.
3. Константный аргумент шаблона, задающий число элементов.
4. Значение каждого элемента.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Это значение нетипового аргумента шаблона.** Размер входит в тип: `std::array<int, 4>` и `std::array<int, 5>` — разные типы.

[Повторить: Non-type template parameter](../lectures/12-templates-classes-functions.md#non-type-template-parameter){target="_blank"}

</details>

::::

:::::
