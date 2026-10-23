---
title: "Квиз: Категории значений и семантика перемещения"
description: "Десять вопросов с объяснениями по теме «Категории значений и семантика перемещения»."
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

[Открыть лекцию](../lectures/19-value-categories-move-semantics.md){.btn .btn-outline-primary target="_blank"}

:::

::::: {.course-quiz}

<p class="quiz-fallback">Без интерактивной проверки можно пройти вопросы самостоятельно: варианты ответа перечислены под каждым вопросом, разбор открывается по нажатию «Ответ и объяснение».</p>

:::: {.quiz-question data-answer="2"}

## Имя переменной

`int x = 3;`. Какова категория выражения `x`?

::: {.quiz-options}
1. У выражения нет категории.
2. `lvalue`.
3. `xvalue`.
4. `prvalue`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`x` — lvalue.** Выражение обозначает конкретный объект; категория значения — свойство выражения, а не синоним изменяемости.

[Повторить: Value categories](../lectures/19-value-categories-move-semantics.md#value-categories){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Именованная rvalue-ссылка

Объявлено `int&& r = 3;`. Какова категория выражения `r`, когда оно используется по имени?

::: {.quiz-options}
1. `lvalue`.
2. Всегда `xvalue`.
3. Зависит только от значения числа.
4. Всегда `prvalue`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Имя `r` — lvalue-выражение.** Тип переменной `int&&` не делает любое выражение с её именем rvalue.

[Повторить: Rvalue reference](../lectures/19-value-categories-move-semantics.md#rvalue-reference){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Что делает move

Что непосредственно делает `std::move(x)` для объекта?

::: {.quiz-options}
1. Всегда вызывает деструктор `x`.
2. Сам переносит все байты и освобождает исходный объект.
3. Обязательно обнуляет `x`.
4. Приводит выражение к соответствующей rvalue-ссылке, позволяя выбрать перемещение.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`std::move` выполняет преобразование категории.** Само перемещение ресурса делает выбранный затем конструктор или оператор присваивания.

[Повторить: std::move](../lectures/19-value-categories-move-semantics.md#stdmove){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Конструктор перемещения

Какая сигнатура соответствует обычному конструктору перемещения класса `Buffer`?

::: {.quiz-options}
1. `Buffer(const Buffer&)`.
2. `void Buffer(Buffer)`.
3. `Buffer(Buffer&&)`.
4. `Buffer& operator=(const Buffer&)`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`Buffer(Buffer&&)`.** Копирующий конструктор обычно принимает `const Buffer&`; оператор присваивания работает с уже существующим объектом.

[Повторить: Move constructor & move assignment](../lectures/19-value-categories-move-semantics.md#move-constructor-move-assignment){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Перемещённый стандартный объект

Объект стандартной библиотеки успешно перемещён; специальных дополнительных гарантий для его типа не указано. Что обычно гарантировано?

::: {.quiz-options}
1. Он всегда пуст.
2. Его нельзя даже уничтожать.
3. Он обязательно равен исходному значению.
4. Он находится в допустимом, но неуточнённом состоянии.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Состояние допустимо, но не уточнено.** Можно уничтожать объект и выполнять операции с соблюдением их предусловий; полагаться на конкретное содержимое нельзя без гарантии типа.

[Повторить: Move constructor & move assignment](../lectures/19-value-categories-move-semantics.md#move-constructor-move-assignment){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Перемещение const

Есть конструкторы `T(const T&)` и `T(T&&)`. Передаётся `std::move` от `const T`. Какой обычно подходит?

::: {.quiz-options}
1. `std::move` автоматически снимает `const`.
2. Перемещающий `T(T&&)`.
3. Копирующий `T(const T&)`.
4. Оба вызываются по очереди.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Подходит копирование.** `std::move` сохраняет `const`, а неконстантная rvalue-ссылка `T&&` не может связаться с `const T`.

[Повторить: std::move](../lectures/19-value-categories-move-semantics.md#stdmove){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Forwarding reference

Когда параметр `T&&` является forwarding reference?

::: {.quiz-options}
1. Когда `T` — выводимый cv-неквалифицированный параметр типа соответствующего шаблона функции.
2. Только когда `T` заранее равен `int`.
3. Только у виртуального метода.
4. При любом употреблении `&&`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Нужен выводимый параметр типа `T`.** Например, `const T&&` и заранее фиксированный `int&&` не являются forwarding references.

[Повторить: Forwarding reference](../lectures/19-value-categories-move-semantics.md#forwarding-reference){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Схлопывание ссылок

Во что схлопывается сочетание `int& &&`, возникающее при подстановке шаблонных типов?

::: {.quiz-options}
1. `int&&`.
2. `int&`.
3. `int`.
4. `const int&`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**В lvalue-ссылку `int&`.** При схлопывании наличие lvalue-ссылки приводит к lvalue-ссылке; только сочетание двух `&&` сохраняет `&&`.

[Повторить: Reference collapsing](../lectures/19-value-categories-move-semantics.md#reference-collapsing){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## forward и move

Для чего внутри функции с forwarding reference используют `std::forward<T>(value)`?

::: {.quiz-options}
1. Чтобы всегда превратить аргумент в rvalue.
2. Чтобы продлить жизнь любого аргумента до конца программы.
3. Чтобы передать дальше категорию, отражённую выводом `T`.
4. Чтобы обязательно скопировать объект.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Для сохранения способа передачи аргумента.** Lvalue передаётся дальше как lvalue, rvalue — как rvalue; безусловный `std::move` этого не делает.

[Повторить: std::forward](../lectures/19-value-categories-move-semantics.md#stdforward){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Устранение копирования

В C++20 функция возвращает объект своего типа выражением `return T{};`. Требуется ли промежуточное копирование или перемещение этого prvalue?

::: {.quiz-options}
1. Всегда требуется ровно одно копирование.
2. Всегда требуются два перемещения.
3. Нет, результат создаётся непосредственно в целевом объекте.
4. Обязательно вызывается `operator=`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Промежуточная копия не нужна.** Гарантированное устранение такого промежуточного объекта отличается от необязательной NRVO для именованной локальной переменной.

[Повторить: Copy elision](../lectures/19-value-categories-move-semantics.md#copy-elision){target="_blank"}

</details>

::::

:::::


Дополнительно: [Вывод аргументов шаблона в проекте стандарта C++20](https://timsong-cpp.github.io/cppwp/n4861/temp.deduct).
