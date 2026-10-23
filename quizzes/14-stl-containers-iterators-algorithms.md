---
title: "Квиз: STL: контейнеры, итераторы и алгоритмы"
description: "Десять вопросов с объяснениями по теме «STL: контейнеры, итераторы и алгоритмы»."
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

[Открыть лекцию](../lectures/14-stl-containers-iterators-algorithms.md){.btn .btn-outline-primary target="_blank"}

:::

::::: {.course-quiz}

<p class="quiz-fallback">Без интерактивной проверки можно пройти вопросы самостоятельно: варианты ответа перечислены под каждым вопросом, разбор открывается по нажатию «Ответ и объяснение».</p>

:::: {.quiz-question data-answer="2"}

## Связь компонентов

Что связывает обобщённый алгоритм STL с элементами контейнера?

::: {.quiz-options}
1. Обязательный сырой указатель `void*`.
2. Итераторы.
3. Только имя контейнера.
4. Наследование всех контейнеров от одного класса.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Итераторы дают общий интерфейс доступа.** Алгоритм задаёт требования к итераторам, а разные контейнеры предоставляют подходящие реализации.

[Повторить: Итераторы](../lectures/14-stl-containers-iterators-algorithms.md#итераторы){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Полуинтервал

Что означает диапазон `[first, last)`?

::: {.quiz-options}
1. `last` всегда указывает на первый элемент.
2. Обе границы включены.
3. Обе границы исключены.
4. `first` включён, `last` обозначает границу после диапазона.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Правая граница не включается.** Указатель или итератор `last` не нужно разыменовывать для обработки этого диапазона.

[Повторить: Итераторы](../lectures/14-stl-containers-iterators-algorithms.md#итераторы){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Пустой диапазон

Как обычно представлен пустой диапазон итераторов?

::: {.quiz-options}
1. Обе границы обязательно `nullptr`.
2. `last` всегда равен нулю.
3. `first == last`.
4. `first` больше `last` на единицу.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Начало совпадает с концом.** Это работает и у контейнеров, чьи итераторы не являются указателями.

[Повторить: Итераторы](../lectures/14-stl-containers-iterators-algorithms.md#итераторы){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Произвольный доступ

Какая категория гарантирует переход `it + n` за константное время?

::: {.quiz-options}
1. Входной итератор.
2. Итератор произвольного доступа.
3. Только двунаправленный итератор.
4. Только выходной итератор.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Random access iterator.** Двунаправленности достаточно для `++` и `--`, но не для константного прыжка на произвольное расстояние.

[Повторить: Итераторы с произвольным доступом](../lectures/14-stl-containers-iterators-algorithms.md#итераторы-с-произвольным-доступом){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Константный итератор

Что ограничивает `const_iterator` контейнера?

::: {.quiz-options}
1. Сравнение с концом диапазона.
2. Чтение элементов.
3. Любое перемещение самого итератора.
4. Изменение элементов через разыменование этого итератора.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Он даёт константный доступ к элементам.** Это не то же самое, что константный объект обычного итератора.

[Повторить: iterator / const_iterator](../lectures/14-stl-containers-iterators-algorithms.md#iterator-const_iterator){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Неуспешный поиск

Что возвращает `std::find(first, last, value)`, если значение не найдено?

::: {.quiz-options}
1. Обязательно `nullptr`.
2. `last`.
3. Число `-1` любого типа.
4. Первый элемент.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Возвращается конечный итератор `last`.** Его сравнивают с результатом, прежде чем пытаться разыменовать найденную позицию.

[Повторить: find](../lectures/14-stl-containers-iterators-algorithms.md#find){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Предикат

Чем `std::find_if` отличается от `std::find` по задаче поиска?

::: {.quiz-options}
1. Работает только с указателями на функции.
2. Возвращает число всех подходящих элементов.
3. Ищет первый элемент, для которого предикат истинен.
4. Всегда сортирует диапазон.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`find_if` использует условие-предикат.** Его можно задать функцией, функтором или лямбдой.

[Повторить: find и find_if](../lectures/14-stl-containers-iterators-algorithms.md#find-и-find_if){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## erase-remove

Что делает `std::remove` сам по себе для диапазона `std::vector`?

::: {.quiz-options}
1. Удаляет файл с исходником.
2. Переставляет сохраняемые элементы и возвращает новый логический конец.
3. Освобождает всю память контейнера.
4. Уменьшает `size()` контейнера.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Возвращает новый логический конец.** Физически сократить контейнер позволяет последующий `erase`; сам алгоритм не меняет его размер.

[Повторить: erase-remove idiom](../lectures/14-stl-containers-iterators-algorithms.md#erase-remove-idiom){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Множественные алгоритмы

Какое предусловие нужно для `std::set_union` на двух диапазонах?

::: {.quiz-options}
1. Оба отсортированы согласно используемому порядку сравнения.
2. Они обязаны иметь равную длину.
3. Оба диапазона обязаны быть `std::set`.
4. Все значения должны совпадать.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Оба диапазона должны быть отсортированы согласованно.** Алгоритм работает через итераторы и не требует именно контейнеров `std::set`.

[Повторить: set_union](../lectures/14-stl-containers-iterators-algorithms.md#set_union){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Начальное значение суммы

Для чего в `std::accumulate` передаётся начальное значение?

::: {.quiz-options}
1. Оно задаёт начальное состояние и тип накопителя.
2. Чтобы обязательно пропустить первый элемент.
3. Только число элементов.
4. Только последнюю позицию.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Начальное значение определяет и тип накопителя.** Поэтому `0` и `0.0` могут привести к разным результатам при накоплении дробных значений.

[Повторить: accumulate](../lectures/14-stl-containers-iterators-algorithms.md#accumulate){target="_blank"}

</details>

::::

:::::
