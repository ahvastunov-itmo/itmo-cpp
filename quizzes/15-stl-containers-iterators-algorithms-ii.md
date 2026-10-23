---
title: "Квиз: STL: контейнеры, итераторы и алгоритмы — II"
description: "Десять вопросов с объяснениями по теме «STL: контейнеры, итераторы и алгоритмы — II»."
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

[Открыть лекцию](../lectures/15-stl-containers-iterators-algorithms-ii.md){.btn .btn-outline-primary target="_blank"}

:::

::::: {.course-quiz}

<p class="quiz-fallback">Без интерактивной проверки можно пройти вопросы самостоятельно: варианты ответа перечислены под каждым вопросом, разбор открывается по нажатию «Ответ и объяснение».</p>

:::: {.quiz-question data-answer="3"}

## Непрерывное хранение

Какой контейнер хранит последовательность `int` непрерывно и умеет менять её размер?

::: {.quiz-options}
1. `std::array<int, 4>`.
2. `std::forward_list<int>`.
3. `std::vector<int>`.
4. `std::list<int>`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`std::vector<int>`.** `array` тоже непрерывен, но его размер задан типом и не меняется; списки используют узлы.

[Повторить: Sequence containers](../lectures/15-stl-containers-iterators-algorithms-ii.md#sequence-containers){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Размер array

Что означает число в типе `std::array<double, 8>`?

::: {.quiz-options}
1. Значение каждого элемента.
2. Фиксированное число элементов, входящее в тип.
3. Текущую ёмкость, свободно растущую при `push_back`.
4. Число потоков обработки.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Фиксированный размер — восемь элементов.** У `std::array` нет операции увеличения размера вроде `push_back`.

[Повторить: std::array](../lectures/15-stl-containers-iterators-algorithms-ii.md#stdarray){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Ключ и значение

Какой контейнер хранит уникальные ключи и связанные значения в порядке ключей?

::: {.quiz-options}
1. `std::vector`.
2. `std::map`.
3. `std::unordered_multiset`.
4. `std::multiset`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`std::map`.** Он связывает ключ с значением и поддерживает порядок согласно компаратору; `multiset` хранит ключи с повторами без отдельного mapped value.

[Повторить: Associative containers](../lectures/15-stl-containers-iterators-algorithms-ii.md#associative-containers){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Хеш-таблица

Какое свойство поиска характерно для `std::unordered_map`?

::: {.quiz-options}
1. Строго `O(1)` в худшем случае при любых данных.
2. Всегда отсортированный обход по ключу.
3. Всегда `O(log n)`, независимо от хеширования.
4. Средняя константная сложность при линейном худшем случае.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**В среднем `O(1)`, в худшем случае `O(n)`.** Качество распределения хешей влияет на поиск; порядок обхода по ключу не гарантирован.

[Повторить: Unordered associative containers](../lectures/15-stl-containers-iterators-algorithms-ii.md#unordered-associative-containers){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Перевыделение vector

`push_back` у `vector` вызвал перевыделение памяти. Что с прежними итераторами и ссылками на элементы?

::: {.quiz-options}
1. Они автоматически перенастраиваются.
2. Сохраняются только итераторы с чётным индексом.
3. Все сохраняются.
4. Все инвалидируются.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Перевыделение инвалидирует прежние итераторы и ссылки.** После изменения контейнера нужно учитывать конкретные правила инвалидирования.

[Повторить: Iterator Invalidation](../lectures/15-stl-containers-iterators-algorithms-ii.md#iterator-invalidation){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Удаление из list

При удалении одного элемента из `std::list` что происходит с итераторами на другие элементы?

::: {.quiz-options}
1. Они остаются действительными.
2. Все становятся `end()`.
3. Все инвалидируются.
4. Они меняют тип.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Итераторы к оставшимся элементам сохраняются.** Инвалидируются итераторы и ссылки на удалённый элемент.

[Повторить: Iterator Invalidation](../lectures/15-stl-containers-iterators-algorithms-ii.md#iterator-invalidation){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Аллокатор

Какова роль аллокатора у контейнера?

::: {.quiz-options}
1. Форматировать вывод.
2. Автоматически сортировать значения.
3. Задавать стратегию управления памятью для элементов.
4. Определять порядок сравнения ключей.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Аллокатор участвует в управлении памятью.** Стратегия выделения отделена от логики самого контейнера.

[Повторить: Allocator](../lectures/15-stl-containers-iterators-algorithms-ii.md#allocator){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Адаптер stack

Какой порядок доступа предлагает `std::stack`?

::: {.quiz-options}
1. Сортировку по ключу.
2. LIFO: первым выходит последний добавленный.
3. FIFO: первым выходит первый добавленный.
4. Произвольный доступ по индексу.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**LIFO.** Адаптер предоставляет стековый интерфейс поверх подходящего базового контейнера.

[Повторить: std::stack](../lectures/15-stl-containers-iterators-algorithms-ii.md#stdstack){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Итератор вставки

Что делает присваивание через `std::back_inserter(container)`?

::: {.quiz-options}
1. Добавляет значение через `push_back`.
2. Перезаписывает первый элемент.
3. Удаляет последний элемент.
4. Только увеличивает счётчик без вставки.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Добавляет элемент в конец.** Такой выходной итератор позволяет алгоритмам записывать результат в растущий контейнер.

[Повторить: back_insert_iterator](../lectures/15-stl-containers-iterators-algorithms-ii.md#back_insert_iterator){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## advance и категории

Как обычно различается стоимость `std::advance(it, n)` для `vector` и `list` при положительном `n`?

::: {.quiz-options}
1. Для `list` — `O(1)`, для `vector` — `O(n)`.
2. Для `vector` — `O(1)`, для `list` — `O(n)`.
3. Операция разрешена только для `vector`.
4. Для обоих всегда `O(1)`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Категория итератора определяет доступную реализацию.** Для произвольного доступа возможен прыжок, для списка нужны последовательные шаги.

[Повторить: Iterator Operation](../lectures/15-stl-containers-iterators-algorithms-ii.md#iterator-operation){target="_blank"}

</details>

::::

:::::
